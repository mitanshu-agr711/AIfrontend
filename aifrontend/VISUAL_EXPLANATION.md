# Visual Explanation of Fixes

## Problem 2 & 3: Time Tracking Issue

### Timeline BEFORE (Wrong):
```
Interview Starts: T0 (startTime = T0)
└─ Q1 appears
└─ User answers at T1 (5 seconds later)
   └─ elapsed = (T1 - T0) = 5 seconds ✓ CORRECT FOR Q1
   └─ startTime is reset to T1, but calculation already done
└─ Q2 appears  
└─ User answers at T2 (8 seconds later)
   └─ PROBLEM: startTime is still T0 when calculation runs!
   └─ elapsed = (T2 - T0) = 13 seconds ❌ WRONG! Should be 8
```

**Result:** First question got 5s, all other questions showed TOTAL time, not individual time!

---

### Timeline AFTER (Fixed):
```
Interview Starts: T0
└─ Q1 appears: questionStartTime = T0
└─ User answers at T1 (5 seconds later)
   └─ elapsed = (T1 - T0) = 5 seconds ✓ CORRECT
   └─ questionStartTime = T1
└─ Q2 appears
└─ User answers at T2 (8 seconds later)
   └─ elapsed = (T2 - T1) = 8 seconds ✓ CORRECT
   └─ questionStartTime = T2
└─ Q3 appears
└─ User answers at T3 (12 seconds later)
   └─ elapsed = (T3 - T2) = 12 seconds ✓ CORRECT
```

**Result:** Each question now shows accurate time taken for THAT question only!

---

## Code Comparison

### BEFORE (Wrong Calculation):
```typescript
const [startTime, setStartTime] = useState<number>(Date.now())

const handleSubmitAnswer = async () => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000)
  // BUG: startTime never changes during calculation
  // So elapsed always measures from interview start
  
  await api.submitAnswer({
    timeTaken: elapsed  // Sends total interview time ❌
  })
  
  setStartTime(Date.now())  // Too late! Already calculated ❌
}
```

---

### AFTER (Fixed Calculation):
```typescript
const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())

const handleSubmitAnswer = async () => {
  const elapsed = Math.floor((Date.now() - questionStartTime) / 1000)
  // FIXED: questionStartTime was set to now when this question appeared
  
  await api.submitAnswer({
    timeTaken: elapsed  // Sends time for THIS question ✓
  })
  
  setQuestionStartTime(Date.now())  // Reset for next question ✓
}
```

---

## Feedback Page Display

### BEFORE:
```
Q1: 18 seconds  (wrong - total time)
Q2: 18 seconds  (wrong - still total time)
Q3: 18 seconds  (wrong - still total time)
Duration: 18 min ❌ (matches Q1 time)
```

### AFTER:
```
Q1: 5 seconds   (correct - time for Q1 only)
Q2: 8 seconds   (correct - time for Q2 only)
Q3: 12 seconds  (correct - time for Q3 only)
Duration: ~25 seconds ✓ (sum of all questions)
```

---

## What You'll See Now

When you take an interview:
✓ Each question shows individual time spent
✓ Total duration is sum of all question times
✓ Feedback page displays accurate per-question metrics
✓ Analytics can now calculate actual performance metrics
