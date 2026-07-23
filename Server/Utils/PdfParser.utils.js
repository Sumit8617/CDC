import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import { uploadOnCloudinary } from "../config/cloudinary.config.js";

/**
 * Extract images from a Word document using mammoth
 */
const extractImagesFromWord = async (buffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const images = [];

    // mammoth doesn't have extractImages - extract images from HTML instead
    const htmlResult = await mammoth.convertToHtml({ buffer });

    // Extract image URLs from HTML if present
    const imgMatches = htmlResult.value.matchAll(/<img[^>]+src="([^"]+)"/g);
    for (const match of imgMatches) {
      images.push({
        url: match[1],
        type: "image",
      });
    }

    // Clean the text - remove HTML tags if any
    let cleanText = result.value;
    cleanText = cleanText.replace(/<[^>]+>/g, " ");
    cleanText = cleanText.replace(/&nbsp;/g, " ");
    cleanText = cleanText.replace(/&amp;/g, "&");
    cleanText = cleanText.replace(/&lt;/g, "<");
    cleanText = cleanText.replace(/&gt;/g, ">");
    cleanText = cleanText.replace(/\s+/g, " ").trim();

    return { text: cleanText, images };
  } catch (error) {
    console.error("Error extracting from Word:", error);
    return { text: "", images: [] };
  }
};

/**
 * Extract text from Word document
 */
const extractFromWord = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    return await extractImagesFromWord(buffer);
  } catch (error) {
    console.error("Error extracting from Word:", error);
    return { text: "", images: [] };
  }
};

/**
 * Parse questions from extracted text
 * Expected format:
 * 1. What is the capital of France?
 * A) London
 * B) Paris
 * C) Berlin
 * D) Madrid
 * Answer: B
 *
 * Image mapping: Images are mapped to questions based on:
 * 1. [Image] marker in the question text
 * 2. Question number matching (if images have question number metadata)
 * 3. Sequential order as fallback
 */
const parseQuestionsFromText = async (text, images = []) => {
  const questions = [];

  if (!text || !text.trim()) {
    console.log("No text content to parse");
    return questions;
  }

  // Join all text and use a better regex to extract questions
  const fullText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Split by numbered questions (1., 2., etc.) but keep the number
  let questionBlocks = fullText.split(/(?=\d+\.\s)/);

  // Filter out empty or title blocks
  questionBlocks = questionBlocks.filter(
    (b) => b.trim().length > 10 && /\d+\.\s/.test(b)
  );

  const totalImages = images.length;
  const totalQuestions = questionBlocks.length;

  console.log(`Total questions: ${totalQuestions}, Total images: ${totalImages}`);

  // FIRST: Analyze each question block to find [Image] markers
  // This builds a map of which question numbers have [Image] markers
  const questionImageMarkers = {};
  const questionsWithImageMarkers = [];

  for (let i = 0; i < questionBlocks.length; i++) {
    const block = questionBlocks[i];

    // Extract question number from the block
    const numMatch = block.match(/^(\d+)\.\s/);
    if (numMatch) {
      const questionNum = parseInt(numMatch[1], 10);

      // Check if this question has an [Image] marker
      if (block.toLowerCase().includes('[image]')) {
        questionImageMarkers[questionNum] = i; // Map question number to block index
        questionsWithImageMarkers.push({ questionNum, blockIndex: i });
      }
    }
  }

  console.log("Questions with [Image] markers:", questionsWithImageMarkers);

  // Build image mapping based on:
  // 1. If images have question number in filename (e.g., "q11.jpg", "question_11.jpg", "11.jpg"), map to that specific question
  // 2. If questions have [Image] markers, map images to those specific question numbers
  // 3. Otherwise, map sequentially

  const questionImageMap = new Array(totalQuestions).fill(null);

  // First, try to match images by question number in filename
  const imageByQuestionNum = {};

  for (let imgIdx = 0; imgIdx < images.length; imgIdx++) {
    const img = images[imgIdx];
    if (!img || !img.url) continue;

    // Try to extract question number from filename
    // Supported patterns: q11.jpg, question_11.jpg, 11.jpg, image_11.png, etc.
    const fileName = img.originalName || '';
    const questionNumMatch = fileName.match(/(?:^|[\s_-])(\d+)(?:[\s_-]|$|\.)/i);

    if (questionNumMatch) {
      const questionNum = parseInt(questionNumMatch[1], 10);
      if (questionNum > 0 && questionNum <= totalQuestions) {
        // Convert 1-based question number to 0-based index
        const blockIndex = questionNum - 1;
        imageByQuestionNum[questionNum] = { blockIndex, url: img.url };
        console.log(`Found image for question ${questionNum} from filename: ${fileName}`);
      }
    }
  }

  // Apply filename-based mapping first (highest priority)
  for (const [questionNum, mapping] of Object.entries(imageByQuestionNum)) {
    if (mapping.blockIndex >= 0 && mapping.blockIndex < totalQuestions) {
      questionImageMap[mapping.blockIndex] = mapping.url;
      console.log(`Mapped image to question ${questionNum} (from filename)`);
    }
  }

  // If we have filename-based mappings, use those
  // Otherwise fall back to [Image] marker or sequential
  const mappedCount = questionImageMap.filter(Boolean).length;

  if (mappedCount > 0) {
    console.log(`Used filename-based mapping for ${mappedCount} images`);
  } else if (questionsWithImageMarkers.length > 0) {
    // Map images to questions that have [Image] markers
    for (let i = 0; i < questionsWithImageMarkers.length; i++) {
      const { blockIndex } = questionsWithImageMarkers[i];
      if (images[i] && images[i].url) {
        questionImageMap[blockIndex] = images[i].url;
        console.log(`Mapped image ${i + 1} to question ${blockIndex + 1} (has [Image] marker)`);
      }
    }

    // For questions without [Image] markers, assign remaining images sequentially
    let imageIndex = questionsWithImageMarkers.length;
    for (let i = 0; i < totalQuestions && imageIndex < totalImages; i++) {
      if (questionImageMap[i] === null && images[imageIndex] && images[imageIndex].url) {
        questionImageMap[i] = images[imageIndex].url;
        console.log(`Mapped image ${imageIndex + 1} to question ${i + 1} (sequential)`);
        imageIndex++;
      }
    }
  } else {
    // No [Image] markers or filename mappings found - assign images sequentially
    for (let i = 0; i < Math.min(totalImages, totalQuestions); i++) {
      if (images[i] && images[i].url) {
        questionImageMap[i] = images[i].url;
      }
    }
  }

  // Now parse each question block
  for (let blockIndex = 0; blockIndex < questionBlocks.length; blockIndex++) {
    const block = questionBlocks[blockIndex];
    if (!block.trim()) continue;

    // Match question number and content
    const questionMatch = block.match(/(?:(\d+)\.?\s*)?([\s\S]*?)$/);
    if (!questionMatch) continue;

    let questionContent = questionMatch[2].trim();

    // Skip if too short to be a question
    if (questionContent.length < 10) continue;

    // Extract options (A, B, C, D) - more flexible pattern
    const options = [];
    let correctOption = -1;

    // Match options with various formats: A) A. A - etc. also support a) a.
    let optionPattern =
      /([A-Da-d])[\.\)]\s*(.+?)(?=[A-Da-d][\.\)]|Correct|Answer|$)/gi;
    let optionMatches = [...questionContent.matchAll(optionPattern)];

    // If no matches with single-line pattern, try multi-line pattern
    if (optionMatches.length < 2) {
      optionPattern =
        /(?:^|\n)\s*([A-Da-d])[\.\)]\s*(.+?)(?=\n[A-Da-d][\.\)]|\nCorrect|\nAnswer|\nAns|$)/gi;
      optionMatches = [...questionContent.matchAll(optionPattern)];
    }

    for (const match of optionMatches) {
      const optionText = match[2].trim();
      if (optionText && optionText.length > 0) {
        options.push(optionText);
      }
    }

    // Extract correct answer - multiple formats
    const answerPatterns = [
      /Correct Answer:\s*([A-D])/i,
      /Correct:\s*([A-D])/i,
      /Answer:\s*([A-D])/i,
      /Ans:\s*([A-D])/i,
      /Key:\s*([A-D])/i,
    ];

    for (const pattern of answerPatterns) {
      const answerMatch = questionContent.match(pattern);
      if (answerMatch) {
        const answerLetter = answerMatch[1].toUpperCase();
        correctOption = answerLetter.charCodeAt(0) - 65;
        break;
      }
    }

    // Alternative: Check for options marked with * or (correct)
    if (correctOption === -1) {
      const lines = questionContent.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.match(/^[A-D][\.\)]\s*.*\*$/) || line.match(/\(correct\)/i)) {
          const optionLetter = line.match(/^([A-D])/i);
          if (optionLetter) {
            correctOption = optionLetter[1].toUpperCase().charCodeAt(0) - 65;
            break;
          }
        }
      }
    }

    // Extract question text (everything before options)
    const splitPatterns = [
      /\n[A-Da-d][\.\)]/i,
      /\s+[A-Da-d][\.\)]\s+/g,
      /\nOption/i,
      /\n[a-d]\)/,
      /\nA\./i,
      /\nB\./i,
    ];

    let questionText = questionContent;
    for (const pattern of splitPatterns) {
      const parts = questionText.split(pattern);
      if (parts.length > 1 && parts[0].trim().length > 5) {
        questionText = parts[0].trim();
        break;
      }
    }

    // Also try to remove options from questionText
    const firstOptionMatch = questionText.match(/([A-D])[\.\)]\s+/i);
    if (firstOptionMatch) {
      const index = questionText.indexOf(firstOptionMatch[0]);
      if (index > 0) {
        questionText = questionText.substring(0, index).trim();
      }
    }

    // Check for [Image] marker in question and remove it, but DON'T assign image here
    // Image assignment is done via the pre-calculated map
    let questionImage = null;
    const imageRefMatch = questionText.match(/\[Image\](.*)/i);
    if (imageRefMatch) {
      questionText = imageRefMatch[1].trim();
      // Use the pre-calculated image map for this question
      questionImage = questionImageMap[blockIndex];
    } else {
      // No [Image] marker - still check if this question should have an image from the map
      questionImage = questionImageMap[blockIndex];
    }

    // Only add if we have at least 2 options
    if (options.length >= 2 && questionText) {
      while (options.length < 4) {
        options.push("");
      }

      questions.push({
        questionText,
        options: options.slice(0, 4),
        correctOption: correctOption >= 0 ? correctOption : 0,
        questionImage,
      });
    }
  }

  console.log("Parsed questions:", questions.length);
  // Log which questions have images
  questions.forEach((q, i) => {
    if (q.questionImage) {
      console.log(`Question ${i + 1} has image: ${q.questionImage.substring(0, 50)}...`);
    }
  });

  return questions;
};

/**
 * Main function to parse Word file and extract questions
 * @param {string} filePath - Path to the Word file
 * @param {Array} uploadedImages - Optional array of images uploaded along with the file
 */
const parseQuestionFile = async (filePath, uploadedImages = []) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    let extractedText = "";
    let images = [];
    let totalPages = 1;

    if (ext === ".docx" || ext === ".doc") {
      const result = await extractFromWord(filePath);
      extractedText = result.text;
      images = result.images;
    } else {
      throw new Error(
        "Unsupported file format. Only Word files (.docx, .doc) are supported."
      );
    }

    // If user uploaded images along with the file, use those
    if (uploadedImages && uploadedImages.length > 0) {
      console.log("Using uploaded images:", uploadedImages.length);
      images = uploadedImages;
    }

    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n{3,}/g, "\n\n");

    // Parse questions from the text
    const questions = await parseQuestionsFromText(extractedText, images);

    return {
      success: true,
      questions,
      totalQuestions: questions.length,
      totalPages,
      message: `Successfully extracted ${questions.length} questions from the file.`,
    };
  } catch (error) {
    console.error("Error parsing question file:", error);
    return {
      success: false,
      questions: [],
      message: error.message || "Failed to parse the file",
    };
  }
};

/**
 * Upload a base64 image to Cloudinary
 */
const uploadBase64Image = async (base64String, folder = "questions") => {
  try {
    const tempPath = `./public/temp/base64_image_${Date.now()}.png`;
    const buffer = Buffer.from(base64String, "base64");
    fs.writeFileSync(tempPath, buffer);

    const result = await uploadOnCloudinary(tempPath);
    return result?.secure_url || null;
  } catch (error) {
    console.error("Error uploading base64 image:", error);
    return null;
  }
};

export {
  parseQuestionFile,
  uploadBase64Image,
  extractFromWord,
  parseQuestionsFromText,
};
