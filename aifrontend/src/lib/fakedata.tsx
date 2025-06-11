export const fakeQAData = [
  {
    id: 1,
    question: "What is useEffect in React?",
    userAnswer: "It is used for calling APIs.",
    botAnswer: "Correct! useEffect is used to perform side effects like API calls, subscriptions, or manually changing the DOM after render."
  },
  {
    id: 2,
    question: "What is the difference between getStaticProps and getServerSideProps in Next.js?",
    userAnswer: "getStaticProps is used for static and getServerSideProps for dynamic.",
    botAnswer: "You're partially right. getStaticProps is used to fetch data at build time, ideal for static pages. getServerSideProps runs on every request, suitable for dynamic pages with frequently changing data."
  },
  {
    id: 3,
    question: "What is a closure in JavaScript?",
    userAnswer: "When a function returns another function.",
    botAnswer: "Close! A closure is when a function retains access to its lexical scope (variables) even after the outer function has finished executing."
  },
  {
    id: 4,
    question: "Explain REST API in simple terms.",
    userAnswer: "It is used to send data using HTTP.",
    botAnswer: "Yes, and to add: REST is an architectural style where APIs use HTTP methods (GET, POST, PUT, DELETE) to interact with resources identified by URLs."
  },
  {
    id: 5,
    question: "What is Zustand?",
    userAnswer: "A state manager for React.",
    botAnswer: "Exactly. Zustand is a small, fast, and scalable state-management solution that works with React without the need for reducers or context."
  }
];
