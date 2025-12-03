// controllers/finalController.js

export const getFinalPage = (req, res) => {
  const { score, total } = req.query;

  const finalScore = Number(score) || 0;
  const totalQuestions = Number(total) || 10;

  let message = "";

  if (finalScore === totalQuestions) {
    message = "Perfect Score! 🌍👑";
  } else if (finalScore >= 8) {
    message = "Amazing! You are a GeoMaster 🌏✨";
  } else if (finalScore >= 5) {
    message = "Nice work! Keep exploring the world 🌎";
  } else {
    message = "Keep practicing! You’re improving 🗺️";
  }

  return res.render("final", {
    score: finalScore,
    totalQuestions,
    performanceMessage: message,
  });
};
