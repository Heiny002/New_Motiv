# Motiv.ai "Add New Goal" Process Framework

Based on your requirements, I've developed a comprehensive framework for the "Add New Goal" process that integrates with Motiv.ai's Coach-Brain architecture.

## 1. Process Overview

The new goal creation process follows a conversational, step-by-step approach that adapts to goal complexity while maintaining these principles:
- Conversational one-question-at-a-time interface
- Required core questions plus dynamic follow-ups
- Automatic framework recommendation
- Progress saving capabilities
- Integration with Apple Watch, social sharing, and accountability features
- Creation of initial Daily Action Plans (DAPs)

## 2. System Architecture Components

### 2.1 UI Components
- `GoalCreationChat`: The conversational interface for goal creation
- `GoalCreationProgressBar`: Visual indicator of completion progress
- `GoalSummaryView`: Displays compiled responses and understanding
- `GoalTimelineCalendar`: Visualizes the goal schedule upon completion
- `ActionPlanReview`: Displays proposed action steps for feedback
- `DAPPreview`: Shows the first Daily Action Plan

### 2.2 Coach Component Functions
- `GoalUnderstandingEngine`: Processes user responses and extracts intent
- `FrameworkRecommender`: Selects appropriate goal frameworks
- `QuestionGenerator`: Creates dynamic, contextual follow-up questions
- `ActionPlanGenerator`: Creates high-level action plan
- `DAPGenerator`: Creates daily action plans
- `ResponseValidator`: Ensures responses are adequate

### 2.3 Brain Component Functions
- `GoalDataManager`: Stores and retrieves goal data
- `ProgressSaver`: Manages saving partial progress
- `IntegrationManager`: Handles connections to Watch, social features, etc.
- `EventScheduler`: Sets up future check-ins and accountability events

## 3. Data Structures

### 3.1 GoalCreationSession
```javascript
{
  session_id: String,
  user_id: String,
  creation_started: Timestamp,
  last_updated: Timestamp,
  completion_percentage: Number,
  current_question_id: String,
  conversation_history: Array<Message>,
  responses: Object, // Structured data from responses
  recommended_framework: String,
  action_plan: Array<ActionStep>,
  daily_action_plans: Array<DAP>,
  integrations: {
    apple_watch: Boolean,
    social_sharing: {
      enabled: Boolean,
      privacy_level: String
    },
    accountability: {
      check_in_frequency: String,
      notification_times: Array<Time>
    }
  },
  status: "in_progress" | "review" | "completed"
}
```

### 3.2 Message
```javascript
{
  id: String,
  timestamp: Timestamp,
  sender: "user" | "coach",
  content: String,
  attachments: Array<Attachment>,
  question_id: String, // If this is a question from the coach
  response_to: String, // ID of the question this answers
  type: "question" | "answer" | "clarification" | "follow_up" | "summary"
}
```

### 3.3 ActionStep
```javascript
{
  id: String,
  title: String,
  description: String,
  estimated_duration: Duration,
  start_date: Date,
  end_date: Date,
  dependencies: Array<String>, // IDs of prerequisite steps
  status: "pending" | "in_progress" | "completed" | "blocked"
}
```

### 3.4 DAP (Daily Action Plan)
```javascript
{
  date: Date,
  tasks: Array<{
    id: String,
    title: String,
    description: String,
    estimated_duration: Duration,
    priority: Number,
    related_to_goal: Boolean,
    status: "pending" | "completed" | "deferred"
  }>,
  notes: String
}
```

## 4. Process Flow with Pseudocode

### 4.1 Initialization Phase

```javascript
function initializeGoalCreation(userId) {
  // Create a new goal creation session
  const sessionId = generateUniqueId();
  
  const session = {
    session_id: sessionId,
    user_id: userId,
    creation_started: getCurrentTimestamp(),
    last_updated: getCurrentTimestamp(),
    completion_percentage: 0,
    current_question_id: null,
    conversation_history: [],
    responses: {},
    recommended_framework: null,
    action_plan: [],
    daily_action_plans: [],
    integrations: {
      apple_watch: false,
      social_sharing: { enabled: false, privacy_level: "private" },
      accountability: { check_in_frequency: "daily", notification_times: [] }
    },
    status: "in_progress"
  };
  
  // Save session to database
  saveGoalCreationSession(session);
  
  // Start the conversation
  askFirstQuestion(sessionId);
  
  return sessionId;
}

function askFirstQuestion(sessionId) {
  const session = getGoalCreationSession(sessionId);
  
  // First question is always about the general goal/task
  const questionId = generateUniqueId();
  const message = {
    id: questionId,
    timestamp: getCurrentTimestamp(),
    sender: "coach",
    content: "What goal or task would you like to work on?",
    question_id: questionId,
    type: "question"
  };
  
  // Update session
  session.current_question_id = questionId;
  session.conversation_history.push(message);
  session.last_updated = getCurrentTimestamp();
  
  // Save session and return question to UI
  saveGoalCreationSession(session);
  return message;
}
```

### 4.2 Question Generation and Response Processing

```javascript
function processUserResponse(sessionId, responseText) {
  const session = getGoalCreationSession(sessionId);
  
  // Save user's response
  const responseId = generateUniqueId();
  const userMessage = {
    id: responseId,
    timestamp: getCurrentTimestamp(),
    sender: "user",
    content: responseText,
    response_to: session.current_question_id,
    type: "answer"
  };
  
  session.conversation_history.push(userMessage);
  
  // Process the response and extract structured data
  const questionType = determineQuestionType(session.current_question_id, session);
  const extractedData = extractDataFromResponse(responseText, questionType, session);
  
  // Save extracted data to appropriate field in responses object
  session.responses[questionType] = extractedData;
  
  // Validate response
  const validationResult = validateResponse(responseText, questionType, session);
  
  if (!validationResult.isValid) {
    // Ask follow-up to get better information
    return askFollowUpQuestion(sessionId, validationResult.reason);
  }
  
  // Update completion percentage
  session.completion_percentage = calculateCompletionPercentage(session);
  
  // Determine next question
  const nextQuestion = determineNextQuestion(session);
  
  if (nextQuestion) {
    return askQuestion(sessionId, nextQuestion);
  } else {
    // All questions complete, move to summary
    return transitionToSummary(sessionId);
  }
}

function determineNextQuestion(session) {
  // Required questions that haven't been answered
  const requiredQuestions = [
    "general_goal",
    "estimated_duration",
    "start_date",
    "success_definition",
    "failure_definition",
    "goal_reason",
    "barriers_to_success",
    "achievement_methods"
  ];
  
  // Find first required question not yet answered
  for (const question of requiredQuestions) {
    if (!session.responses[question]) {
      return question;
    }
  }
  
  // If we've covered all required questions, determine if additional questions are needed
  // based on goal complexity and previous answers
  const goalComplexity = assessGoalComplexity(session.responses);
  
  if (goalComplexity === "complex" && !session.responses.milestones) {
    return "milestones";
  }
  
  if (session.responses.barriers_to_success && session.responses.barriers_to_success.length > 2 && 
      !session.responses.barrier_mitigation_strategies) {
    return "barrier_mitigation_strategies";
  }
  
  // Integration questions if not already answered
  if (!session.responses.apple_watch_integration) {
    return "apple_watch_integration";
  }
  
  if (!session.responses.social_sharing_preferences) {
    return "social_sharing_preferences";
  }
  
  if (!session.responses.accountability_preferences) {
    return "accountability_preferences";
  }
  
  // No more questions needed
  return null;
}

function askQuestion(sessionId, questionType) {
  const session = getGoalCreationSession(sessionId);
  
  // Generate question text based on question type and session context
  const questionText = generateQuestionText(questionType, session);
  
  const questionId = generateUniqueId();
  const message = {
    id: questionId,
    timestamp: getCurrentTimestamp(),
    sender: "coach",
    content: questionText,
    question_id: questionId,
    type: "question"
  };
  
  // Update session
  session.current_question_id = questionId;
  session.conversation_history.push(message);
  session.last_updated = getCurrentTimestamp();
  
  // Save session and return question to UI
  saveGoalCreationSession(session);
  return message;
}

function askFollowUpQuestion(sessionId, reason) {
  const session = getGoalCreationSession(sessionId);
  
  // Generate follow-up question text based on reason for follow-up
  const followUpText = generateFollowUpQuestionText(reason, session);
  
  const questionId = generateUniqueId();
  const message = {
    id: questionId,
    timestamp: getCurrentTimestamp(),
    sender: "coach",
    content: followUpText,
    question_id: questionId,
    type: "follow_up"
  };
  
  // Update session
  session.current_question_id = questionId;
  session.conversation_history.push(message);
  session.last_updated = getCurrentTimestamp();
  
  // Save session and return question to UI
  saveGoalCreationSession(session);
  return message;
}
```

### 4.3 Framework Recommendation

```javascript
function recommendFramework(sessionId) {
  const session = getGoalCreationSession(sessionId);
  
  // Analyze responses to determine appropriate framework
  const frameworkAnalysis = analyzeForFrameworkRecommendation(session.responses);
  
  // Select best framework based on analysis
  let recommendedFramework;
  
  if (isRoutineHabit(session.responses)) {
    recommendedFramework = "PowerList";
  } else if (isTimeboxedProject(session.responses)) {
    recommendedFramework = "SMART";
  } else if (isPrioritizationNeeded(session.responses)) {
    recommendedFramework = "Eisenhower";
  } else if (isIntensiveCommitment(session.responses)) {
    recommendedFramework = "75Hard";
  } else if (hasManySubtasks(session.responses)) {
    recommendedFramework = "TimeBlocking";
  } else {
    // Default to SMART if no clear winner
    recommendedFramework = "SMART";
  }
  
  // Update session with recommendation
  session.recommended_framework = recommendedFramework;
  saveGoalCreationSession(session);
  
  return recommendedFramework;
}

function generateFrameworkExplanation(sessionId) {
  const session = getGoalCreationSession(sessionId);
  const framework = session.recommended_framework;
  
  // Create explanation of why this framework was chosen
  const explanation = generateFrameworkExplanationText(framework, session.responses);
  
  // Create message to present recommendation to user
  const messageId = generateUniqueId();
  const message = {
    id: messageId,
    timestamp: getCurrentTimestamp(),
    sender: "coach",
    content: explanation,
    type: "summary"
  };
  
  // Add to conversation history
  session.conversation_history.push(message);
  saveGoalCreationSession(session);
  
  return message;
}
```

### 4.4 Summary and Understanding

```javascript
function transitionToSummary(sessionId) {
  const session = getGoalCreationSession(sessionId);
  
  // First recommend a framework
  recommendFramework(sessionId);
  
  // Generate summary of understanding based on responses
  const summary = generateUnderstandingSummary(session);
  
  const messageId = generateUniqueId();
  const message = {
    id: messageId,
    timestamp: getCurrentTimestamp(),
    sender: "coach",
    content: summary,
    type: "summary"
  };
  
  // Update session
  session.conversation_history.push(message);
  session.status = "review";
  session.last_updated = getCurrentTimestamp();
  
  // Save session and return summary to UI
  saveGoalCreationSession(session);
  
  // Also return the framework explanation
  const frameworkExplanation = generateFrameworkExplanation(sessionId);
  
  return { summaryMessage: message, frameworkExplanation };
}

function processUnderstandingFeedback(sessionId, isCorrect, feedbackText) {
  if (isCorrect) {
    // Move to action plan generation
    return generateInitialActionPlan(sessionId);
  } else {
    // Process feedback and ask clarification questions
    return handleMisunderstandingFeedback(sessionId, feedbackText);
  }
}
```

### 4.5 Action Plan Generation

```javascript
function generateInitialActionPlan(sessionId) {
  const session = getGoalCreationSession(sessionId);
  
  // Generate action plan based on goal framework and responses
  const actionPlan = createActionPlanForFramework(
    session.recommended_framework,
    session.responses
  );
  
  // Update session with action plan
  session.action_plan = actionPlan;
  saveGoalCreationSession(session);
  
  // Create message to present action plan to user
  const planText = formatActionPlanForPresentation(actionPlan);
  const messageId = generateUniqueId();
  const message = {
    id: messageId,
    timestamp: getCurrentTimestamp(),
    sender: "coach",
    content: planText,
    type: "summary"
  };
  
  // Add to conversation history
  session.conversation_history.push(message);
  saveGoalCreationSession(session);
  
  return message;
}

function processActionPlanFeedback(sessionId, isApproved, feedbackText) {
  if (isApproved) {
    // Move to breaking down into steps
    return breakdownActionPlanIntoSteps(sessionId);
  } else {
    // Process feedback and revise action plan
    return reviseActionPlan(sessionId, feedbackText);
  }
}

function breakdownActionPlanIntoSteps(sessionId) {
  const session = getGoalCreationSession(sessionId);
  
  // Create detailed steps from the high-level action plan
  const detailedSteps = createDetailedStepsFromActionPlan(
    session.action_plan,
    session.recommended_framework,
    session.responses
  );
  
  // Update action plan with detailed steps
  session.action_plan = detailedSteps;
  saveGoalCreationSession(session);
  
  // Present steps to user
  const stepsText = formatStepsForPresentation(detailedSteps);
  const messageId = generateUniqueId();
  const message = {
    id: messageId,
    timestamp: getCurrentTimestamp(),
    sender: "coach",
    content: stepsText,
    type: "summary"
  };
  
  // Add to conversation history
  session.conversation_history.push(message);
  saveGoalCreationSession(session);
  
  return message;
}
```

### 4.6 Daily Action Plan (DAP) Generation

```javascript
function generateInitialDAPs(sessionId) {
  const session = getGoalCreationSession(sessionId);
  
  // Create first two DAPs based on action plan steps and start date
  const startDate = new Date(session.responses.start_date);
  
  // Generate first DAP for start date
  const firstDAP = createDailyActionPlan(
    startDate,
    session.action_plan,
    session.recommended_framework,
    session.responses
  );
  
  // Generate second DAP for day after start date
  const secondDayDate = new Date(startDate);
  secondDayDate.setDate(startDate.getDate() + 1);
  
  const secondDAP = createDailyActionPlan(
    secondDayDate,
    session.action_plan,
    session.recommended_framework,
    session.responses
  );
  
  // Save DAPs to session
  session.daily_action_plans = [firstDAP, secondDAP];
  saveGoalCreationSession(session);
  
  // Present only first DAP to user
  const dapText = formatDAPForPresentation(firstDAP);
  const messageId = generateUniqueId();
  const message = {
    id: messageId,
    timestamp: getCurrentTimestamp(),
    sender: "coach",
    content: dapText,
    type: "summary"
  };
  
  // Add to conversation history
  session.conversation_history.push(message);
  saveGoalCreationSession(session);
  
  return message;
}

function createDailyActionPlan(date, actionPlan, framework, responses) {
  // Initialize DAP
  const dap = {
    date: date,
    tasks: [],
    notes: ""
  };
  
  // Add 5-7 tasks based on action plan steps relevant to this date
  const relevantSteps = findStepsForDate(date, actionPlan);
  
  // Convert steps to tasks
  relevantSteps.forEach(step => {
    dap.tasks.push({
      id: generateUniqueId(),
      title: step.title,
      description: step.description,
      estimated_duration: estimateTaskDuration(step),
      priority: calculateTaskPriority(step, framework, responses),
      related_to_goal: true,
      status: "pending"
    });
  });
  
  // If we have fewer than 5 tasks, add generic tasks based on framework
  while (dap.tasks.length < 5) {
    dap.tasks.push(generateFrameworkSupportiveTask(framework, responses, dap));
  }
  
  // Cap at 10 tasks
  if (dap.tasks.length > 10) {
    dap.tasks = dap.tasks.slice(0, 10);
  }
  
  // Add notes based on responses
  dap.notes = generateDAPNotes(date, framework, responses);
  
  return dap;
}
```

### 4.7 Goal Finalization

```javascript
function finalizeGoalCreation(sessionId) {
  const session = getGoalCreationSession(sessionId);
  
  // Create the actual goal object from the session data
  const goalData = {
    user_id: session.user_id,
    title: session.responses.general_goal,
    description: generateGoalDescription(session.responses),
    framework: session.recommended_framework,
    start_date: new Date(session.responses.start_date),
    estimated_end_date: calculateEndDate(session.responses),
    success_definition: session.responses.success_definition,
    failure_definition: session.responses.failure_definition,
    motivation: session.responses.goal_reason,
    barriers: session.responses.barriers_to_success,
    methods: session.responses.achievement_methods,
    action_plan: session.action_plan,
    daily_action_plans: session.daily_action_plans,
    integrations: session.integrations,
    created_at: getCurrentTimestamp(),
    status: "active",
    progress: 0
  };
  
  // Save the goal to the database
  const goalId = saveGoal(goalData);
  
  // Schedule initial check-ins and reminders
  scheduleGoalEvents(goalId, goalData);
  
  // Mark session as completed
  session.status = "completed";
  saveGoalCreationSession(session);
  
  // Return success message and goal ID
  return {
    success: true,
    goal_id: goalId,
    message: "Goal successfully created!"
  };
}

function scheduleGoalEvents(goalId, goalData) {
  // Schedule start date notification
  scheduleNotification(
    goalData.user_id,
    goalId,
    goalData.start_date,
    "goal_start",
    `Time to start your goal: ${goalData.title}`
  );
  
  // Schedule first check-in
  const checkInFrequency = goalData.integrations.accountability.check_in_frequency;
  const firstCheckInDate = calculateFirstCheckInDate(goalData.start_date, checkInFrequency);
  
  scheduleCheckIn(
    goalData.user_id,
    goalId,
    firstCheckInDate,
    "first_check_in",
    "How's your progress on your new goal?"
  );
  
  // Schedule milestone reminders if applicable
  if (hasMilestones(goalData.action_plan)) {
    scheduleMilestoneReminders(goalData.user_id, goalId, goalData.action_plan);
  }
}
```

### 4.8 Progress Saving and Resuming

```javascript
function saveGoalCreationProgress(sessionId) {
  const session = getGoalCreationSession(sessionId);
  
  // Update last_updated timestamp
  session.last_updated = getCurrentTimestamp();
  
  // Save to database
  saveGoalCreationSession(session);
  
  return {
    success: true,
    message: "Progress saved successfully",
    completion_percentage: session.completion_percentage
  };
}

function resumeGoalCreation(sessionId) {
  const session = getGoalCreationSession(sessionId);
  
  if (!session) {
    return {
      success: false,
      message: "Session not found"
    };
  }
  
  // Determine where in the process we left off
  if (session.status === "in_progress") {
    // We were in the middle of questions
    // Return current question
    const currentQuestionMessage = session.conversation_history.find(
      msg => msg.id === session.current_question_id
    );
    
    return {
      success: true,
      current_state: "questioning",
      current_question: currentQuestionMessage,
      completion_percentage: session.completion_percentage
    };
  } else if (session.status === "review") {
    // We were in summary/review phase
    return {
      success: true,
      current_state: "review",
      summary: getSummaryFromConversation(session.conversation_history),
      completion_percentage: session.completion_percentage
    };
  }
  
  // Should never get here if state is properly maintained
  return {
    success: false,
    message: "Unknown session state"
  };
}
```

## 5. Integration Points

### 5.1 Apple Watch Integration

```javascript
function setupAppleWatchIntegration(sessionId, preferences) {
  const session = getGoalCreationSession(sessionId);
  
  // Save integration preferences
  session.integrations.apple_watch = true;
  
  // Determine which metrics to track based on goal type
  const goalType = determineGoalType(session.responses);
  const metricsToTrack = determineRelevantWatchMetrics(goalType, preferences);
  
  // Save metrics configuration
  session.responses.apple_watch_metrics = metricsToTrack;
  
  saveGoalCreationSession(session);
  
  return {
    success: true,
    tracking_metrics: metricsToTrack
  };
}

function determineRelevantWatchMetrics(goalType, preferences) {
  const metrics = [];
  
  // Add metrics based on goal type
  if (goalType === "fitness" || goalType === "health") {
    metrics.push("activity", "exercise_minutes", "heart_rate");
  }
  
  if (goalType === "wellness" || goalType === "mindfulness") {
    metrics.push("heart_rate_variability", "sleep_quality", "stand_hours");
  }
  
  // Add user-selected metrics
  if (preferences && preferences.additional_metrics) {
    metrics.push(...preferences.additional_metrics);
  }
  
  return metrics;
}
```

### 5.2 Social Sharing Integration

```javascript
function setupSocialSharingPreferences(sessionId, preferences) {
  const session = getGoalCreationSession(sessionId);
  
  // Save social sharing preferences
  session.integrations.social_sharing = {
    enabled: preferences.enabled,
    privacy_level: preferences.privacy_level || "private",
    auto_share_milestones: preferences.auto_share_milestones || false,
    auto_share_completion: preferences.auto_share_completion || false
  };
  
  // Save preferences to responses
  session.responses.social_sharing_preferences = session.integrations.social_sharing;
  
  saveGoalCreationSession(session);
  
  return {
    success: true,
    sharing_config: session.integrations.social_sharing
  };
}
```

### 5.3 Accountability Integration

```javascript
function setupAccountabilitySystem(sessionId, preferences) {
  const session = getGoalCreationSession(sessionId);
  
  // Save accountability preferences
  session.integrations.accountability = {
    check_in_frequency: preferences.check_in_frequency || "daily",
    notification_times: preferences.notification_times || ["18:00"],
    reminder_intensity: preferences.reminder_intensity || "moderate",
    missed_check_in_escalation: preferences.missed_check_in_escalation || false
  };
  
  // Save to responses
  session.responses.accountability_preferences = session.integrations.accountability;
  
  saveGoalCreationSession(session);
  
  return {
    success: true,
    accountability_config: session.integrations.accountability
  };
}
```

## 6. Error Handling

```javascript
function handleGoalCreationError(sessionId, error) {
  const session = getGoalCreationSession(sessionId);
  
  // Log error
  console.error(`Goal creation error for session ${sessionId}:`, error);
  
  // Save error state
  session.errors = session.errors || [];
  session.errors.push({
    timestamp: getCurrentTimestamp(),
    error_message: error.message,
    error_code: error.code,
    recoverable: isRecoverableError(error)
  });
  
  saveGoalCreationSession(session);
  
  // Return appropriate message to user
  if (isRecoverableError(error)) {
    return {
      success: false,
      message: "We encountered a temporary issue. Would you like to try again or save your progress?",
      recoverable: true
    };
  } else {
    return {
      success: false,
      message: "We're having trouble creating your goal. Your progress has been saved.",
      recoverable: false
    };
  }
}
```

## 7. Implementation Recommendations

1. **Adopt a State Machine Pattern**: The goal creation process follows natural states (questioning, reviewing, action planning, etc.), making a state machine pattern ideal for managing transitions.

2. **Leverage the Coach-Brain Architecture**: Integrate with the existing architecture by having the Coach handle conversational aspects while the Brain manages data persistence and event scheduling.

3. **Use Streaming Responses**: For a natural conversational feel, implement streaming responses from the AI when generating summaries or plans.

4. **Implement Progressive Loading**: To optimize performance, load only the necessary components at each step of the process.

5. **Consider Privacy and Data Security**: Pay special attention to securing goal data, particularly for health-related goals or integration with Apple Watch data.

6. **Build Unit Tests**: Create comprehensive tests for each function, particularly the core logic for framework recommendation and DAP generation.

7. **Include Analytics Hooks**: Add measurement points throughout the flow to gather data on completion rates, common drop-off points, and question effectiveness.

This framework balances user experience with functionality by providing a conversational, adaptive goal-setting process that seamlessly integrates with Motiv.ai's core capabilities. The pseudocode should provide your programmer with clear direction for implementation.