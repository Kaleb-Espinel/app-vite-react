import { useEffect, useState } from "react";
import "./index.css";

export function Questions() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const TOTAL_QUESTIONS = 7;

  // Cargar y mezclar preguntas
  useEffect(() => {
    fetch("./data.json")
      .then((res) => res.json())
      .then((data) => {
        const activeQuestions = data.filter(
          (item) => Boolean(item.clase)
        );

        const shuffled = [...activeQuestions]
          .sort(() => Math.random() - 0.5)
          .slice(0, TOTAL_QUESTIONS);

        setQuestions(shuffled);
      })
      .catch((error) =>
        console.error("Error al cargar preguntas", error)
      );
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleChange = (questionId, selectedAnswer) => {
    setAnswers({
      ...answers,
      [questionId]: selectedAnswer,
    });
  };

  const handleNext = () => {
    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const getScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correct++;
      }
    });
    return correct;
  };

  if (questions.length === 0) {
    return <p className="p-4 text-xl font-bold">Cargando preguntas...</p>;
  }

  // RESULTADOS FINALES
  if (showResults) {
    const score = getScore();
    return (
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-3xl font-bold mb-4">Resultados</h2>
        <p
          className={`text-2xl font-bold ${
            score >= 4 ? "text-green-700" : "text-red-600"
          }`}
        >
          Acertaste {score} de {TOTAL_QUESTIONS}
        </p>
      </div>
    );
  }

  // PREGUNTA ACTUAL
  return (
    <div className="m-5 bg-blue-300 p-4 rounded-md">
      <h3 className="text-xl font-bold mb-3">
        Pregunta {currentIndex + 1} de {TOTAL_QUESTIONS}
      </h3>

      <p className="text-lg font-semibold mb-4">
        {currentQuestion.question}
      </p>

      <div className="bg-gray-700 text-white rounded-md p-2">
        {[currentQuestion.a1, currentQuestion.a2, currentQuestion.a3, currentQuestion.a4].map(
          (answer, index) => {
            const inputId = `q${currentQuestion.id}-${index}`;
            return (
              <label
                key={inputId}
                htmlFor={inputId}
                className="flex items-center p-2 cursor-pointer"
              >
                <input
                  type="radio"
                  id={inputId}
                  name="answer"
                  value={answer}
                  checked={answers[currentQuestion.id] === answer}
                  onChange={() =>
                    handleChange(currentQuestion.id, answer)
                  }
                  className="mr-3"
                />
                {answer}
              </label>
            );
          }
        )}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
          className={`px-4 py-2 rounded-md font-bold ${
            answers[currentQuestion.id]
              ? "bg-green-400 hover:bg-green-500"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {currentIndex === TOTAL_QUESTIONS - 1
            ? "Finalizar"
            : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
