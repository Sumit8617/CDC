/**
 * Question Shuffling Utility
 * Randomizes question order per user for anti-cheating
 */

/**
 * Fisher-Yates shuffle algorithm - shuffles array in place
 * @param {Array} array - Array to shuffle
 * @returns {Array} - New shuffled array
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Shuffle questions uniquely for a specific user
 * @param {Array} questions - Array of question objects
 * @param {string} userId - User ID for seeding (optional - for consistent shuffle)
 * @returns {Array} - Shuffled questions with position mapping
 */
export const shuffleQuestionsForUser = (questions, userId = null) => {
  if (!questions || questions.length === 0) {
    return { questions: [], positionMap: {}, originalCount: 0 };
  }

  // Create a seed from userId for consistent per-user shuffle
  let seededRandom;
  if (userId) {
    // Simple hash function for userId
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash = hash & hash;
    }
    seededRandom = () => {
      hash = Math.sin(hash) * 10000;
      return hash - Math.floor(hash);
    };
  } else {
    seededRandom = Math.random;
  }

  // Fisher-Yates with seeded random
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Create position mapping: original index -> shuffled position
  const positionMap = {};
  shuffled.forEach((q, newIndex) => {
    positionMap[q._id.toString()] = newIndex;
  });

  return {
    questions: shuffled,
    positionMap,
    originalCount: questions.length
  };
};

/**
 * Shuffle options within each question
 * @param {Array} questions - Array of question objects with options
 * @param {string} userId - User ID for seeding
 * @returns {Array} - Questions with shuffled options
 */
export const shuffleOptionsForUser = (questions, userId = null) => {
  if (!questions || questions.length === 0) {
    return [];
  }

  // Create a seed from userId for consistent option shuffle per user
  let seed;
  if (userId) {
    // Simple hash function for userId
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash = hash & hash;
    }
    seed = Math.abs(hash);
  } else {
    seed = Math.random() * 1000;
  }

  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  return questions.map(question => {
    // Shuffle options
    const options = [...question.options];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    // Find new correct option index
    const originalCorrectIndex = question.correctOption;
    const newCorrectIndex = options.indexOf(question.options[originalCorrectIndex]);

    return {
      ...question,
      options,
      correctOption: newCorrectIndex,
      originalCorrectOption: originalCorrectIndex // Keep original for grading
    };
  });
};

/**
 * Full shuffle - questions and options both randomized per user
 * @param {Array} questions - Original questions
 * @param {string} userId - User ID
 * @returns {Object} - Shuffled questions + mapping data
 */
export const shuffleForUser = (questions, userId) => {
  // First shuffle questions
  const { questions: shuffledQuestions, positionMap, originalCount } = shuffleQuestionsForUser(questions, userId);

  // Then shuffle options within each question
  const shuffledWithOptions = shuffleOptionsForUser(shuffledQuestions, userId);

  return {
    questions: shuffledWithOptions,
    positionMap,
    originalCount: originalCount || shuffledQuestions.length,
    userId,
    shuffledAt: new Date().toISOString()
  };
};

/**
 * Map user's submitted answers back to original question positions
 * @param {Array} submittedAnswers - User's submitted answers { questionId, optionIndex }
 * @param {Object} positionMap - Original -> Shuffled position mapping
 * @returns {Object} - Mapped answers { originalQuestionId: optionIndex }
 */
export const mapAnswersToOriginal = (submittedAnswers, positionMap) => {
  const mapped = {};

  submittedAnswers.forEach(submission => {
    const questionId = submission.question;
    const shuffledPosition = positionMap[questionId];

    // Find the original question using reverse mapping
    // This would need the inverse mapping stored during shuffle
    mapped[questionId] = {
      option: submission.submittedOption,
      shuffledPosition
    };
  });

  return mapped;
};

export default {
  shuffleArray,
  shuffleQuestionsForUser,
  shuffleOptionsForUser,
  shuffleForUser,
  mapAnswersToOriginal
};
