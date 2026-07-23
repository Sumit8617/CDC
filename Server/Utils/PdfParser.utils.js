import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import { uploadOnCloudinary } from "../config/cloudinary.config.js";
import { PDFParse } from "pdf-parse";
import { fromPath } from "pdf2pic";

//Extract images from a Word document using mammoth
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
 * Extract text and images from a PDF file
 * Uses pdf2pic with proper error handling
 */
const extractFromPdf = async (filePath) => {
  let parser;
  try {
    const dataBuffer = fs.readFileSync(filePath);

    parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();

    // Extract images from PDF using pdf2pic (convert PDF pages to images)
    const images = [];

    try {
      // Ensure temp directory exists
      const tempDir = "./public/temp";
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const pdf2pic = fromPath(filePath, {
        density: 150,
        saveFilename: "temp_pdf_image",
        savePath: tempDir,
        format: "png",
        width: 1200,
        height: 1800,
      });

      // Get total pages - pdf2pic returns a function with a pageCount property
      // Use identify to get page count
      let pageCount = 1;
      try {
        const pageInfo = await pdf2pic.identify(filePath, "%p ");
        if (pageInfo) {
          const pages = pageInfo
            .trim()
            .split(" ")
            .map((p) => parseInt(p, 10))
            .filter((p) => !isNaN(p));
          pageCount = pages.length > 0 ? Math.max(...pages) : 1;
        }
      } catch (e) {
        console.log("Could not get page count, defaulting to 1:", e.message);
      }

      // Try to convert each page to image
      for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
        try {
          // Use the converter function with base64 response
          const converter = pdf2pic(pageNum, { responseType: "base64" });
          const pageResult = await converter;

          if (
            pageResult &&
            pageResult.base64 &&
            pageResult.base64.length > 100
          ) {
            // Only add if we have meaningful base64 content
            images.push({
              url: `data:image/png;base64,${pageResult.base64}`,
              type: "image/png",
              pageNumber: pageNum,
            });
          }
        } catch (e) {
          console.log(`Error extracting page ${pageNum}:`, e.message);
        }
      }

      // Clean up temp files
      try {
        if (fs.existsSync(tempDir)) {
          fs.readdirSync(tempDir).forEach((file) => {
            if (file.startsWith("temp_pdf_image")) {
              fs.unlinkSync(`${tempDir}/${file}`);
            }
          });
        }
      } catch (e) {
        // Ignore cleanup errors
      }
    } catch (imgError) {
      console.log("Could not extract images from PDF:", imgError.message);
    }

    console.log("PDF extracted images:", images.length);

    return {
      text: result.text,
      images: images,
      totalPages: result.numpages || result.pages?.length || 1,
    };
  } catch (error) {
    console.error("Error extracting from PDF:", error);
    return { text: "", images: [], totalPages: 0 };
  } finally {
    if (parser && typeof parser.destroy === "function") {
      try {
        await parser.destroy();
      } catch (e) {}
    }
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
 */
const parseQuestionsFromText = async (text, images = []) => {
  const questions = [];

  if (!text || !text.trim()) {
    console.log("No text content to parse");
    return questions;
  }

  // Join all text and use a better regex to extract questions
  // Pattern to match: number. question text + options + answer
  const fullText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Split by numbered questions (1., 2., etc.) but keep the number
  let questionBlocks = fullText.split(/(?=\d+\.\s)/);

  // Filter out empty or title blocks
  questionBlocks = questionBlocks.filter(
    (b) => b.trim().length > 10 && /\d+\.\s/.test(b)
  );

  // Images are typically at the end of the document, so assign them to the last N questions
  // where N = number of images
  const totalImages = images.length;
  const totalQuestions = questionBlocks.length;

  // Calculate which question index should get the first image
  const firstImageQuestionIndex = Math.max(0, totalQuestions - totalImages);

  console.log(
    `Total questions: ${totalQuestions}, Total images: ${totalImages}, First image at index: ${firstImageQuestionIndex}`
  );

  for (let blockIndex = 0; blockIndex < questionBlocks.length; blockIndex++) {
    const block = questionBlocks[blockIndex];
    if (!block.trim()) continue;

    // Match question number and content (optional number)
    const questionMatch = block.match(/(?:(\d+)\.?\s*)?([\s\S]*?)$/);
    if (!questionMatch) continue;

    let questionContent = questionMatch[2].trim();

    // Skip if too short to be a question
    if (questionContent.length < 10) continue;

    // Extract options (A, B, C, D) - more flexible pattern
    const options = [];
    let correctOption = -1;

    // Match options with various formats: A) A. A - etc. also support a) a.
    // Works with or without newlines between options
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
    // Try multiple patterns including single-line format
    const splitPatterns = [
      /\n[A-Da-d][\.\)]/i, // Newline + A. B. etc.
      /\s+[A-Da-d][\.\)]\s+/g, // Space + A. B. etc. (single line format)
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

    // Also try to remove options from questionText if still contains them
    // by finding the first option letter (works for both newline and single-line formats)
    const firstOptionMatch = questionText.match(/([A-D])[\.\)]\s+/i);
    if (firstOptionMatch) {
      const index = questionText.indexOf(firstOptionMatch[0]);
      if (index > 0) {
        questionText = questionText.substring(0, index).trim();
      }
    }

    // Check for image reference in question (supports both [Image] and [image] markers)
    let questionImage = null;
    const imageRefMatch = questionText.match(/\[Image\](.*)/i);
    if (imageRefMatch) {
      questionText = imageRefMatch[1].trim();
    }

    // Auto-assign images to questions based on position (images at end of document)
    // This works even without [Image] marker
    const imageArrayIndex = blockIndex - firstImageQuestionIndex;
    if (imageArrayIndex >= 0 && imageArrayIndex < images.length) {
      questionImage = images[imageArrayIndex].url;
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
  return questions;
};

/**
 * Main function to parse PDF/Word file and extract questions
 */
const parseQuestionFile = async (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    let extractedText = "";
    let images = [];
    let totalPages = 1;

    if (ext === ".pdf") {
      const result = await extractFromPdf(filePath);
      extractedText = result.text;
      images = result.images;
      totalPages = result.totalPages || 1;
    } else if (ext === ".docx" || ext === ".doc") {
      const result = await extractFromWord(filePath);
      extractedText = result.text;
      images = result.images;
    } else {
      throw new Error(
        "Unsupported file format. Please upload PDF or Word files."
      );
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
  extractFromPdf,
  extractFromWord,
  parseQuestionsFromText,
};
