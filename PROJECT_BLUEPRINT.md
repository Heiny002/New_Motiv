# Motiv App: AI Coding Agent Reference

## Overview
Motiv is a goal-oriented coaching application that leverages two core AI systems: the Coach (user-facing, conversational, adaptive) and the Brain (backend, memory, timers, pattern recognition). The interplay between these systems creates a highly personalized, context-aware user experience.

---

## System Architecture
- **Coach:** Handles all user interaction via chat, guides, and check-ins. Adapts tone, granularity, and escalation based on user needs and context.
- **Brain:** Manages memory (short, medium, long-term, and Front of Mind), timers, reminders, and pattern recognition. Signals Coach with relevant prompts and context.
- **User:** Interacts only through the Coach. All requests (reminders, memory edits, calendar events) are mediated by the Coach.

---

## Memory Model
- **Short-Term Memory (STM):** Ephemeral, holds recent actions and context. Regularly summarized and mostly discarded unless a summary or unique event is detected.
- **Medium-Term Memory (MTM):** Holds summaries and important events for up to 2 days. Receives summaries or pivotal events from STM.
- **Long-Term Memory (LTM):** Stores biographical, preference, and pattern data. Strong privacy protections, especially for off-device storage.
- **Front of Mind (FOM):** Persistent, separate from STM. Contains critical biographical info, user preferences, and key patterns. Always referenced before Coach responses. Regularly updated, with old info summarized or replaced.

---

## Coach/Brain Interplay
- All user actions are mediated by the Coach, which signals the Brain for memory, timers, and reminders.
- Coach-to-Brain requests use structured, keyword-driven language with reason/context fields for auditability and pattern recognition.
- Brain prompts Coach with relevant information for check-ins, follow-ups, and context-sensitive responses.

---

## User Interaction Rules
- Users can initiate reminders, memory entries, and calendar events, but only through the Coach.
- Users can view memory stores; edits must be requested via Coach. Stubborn memories can be escalated for manual removal.
- Mandatory check-ins: Morning/Evening (Power List creation/review). Other check-ins are goal-dependent and slightly adjustable.
- Coach adapts task granularity and tone based on onboarding and ongoing user behavior.
- After long absences, Coach initiates a mini-onboarding to recalibrate goals and timelines.

---

## Pattern Recognition & Feedback
- Brain recognizes patterns after ~3 occurrences (context/frequency dependent).
- Coach proactively surfaces patterns to the user, discusses them, and collaboratively decides on changes. Patterns cannot be ignored or erased; they must be addressed.
- Repeated snoozing or missed check-ins prompt dialog and possible routine refinement.

---

## Edge Cases & Data Handling
- FOM items flagged for removal: System warns, then escalates if critical.
- Device sync is critical; no device-specific features for now.
- Users can request a full data export before deletion/anonymization. Regulatory compliance TBD.
- After long user absences, Coach resumes with a gentle onboarding and timeline adjustment.

---

*This section is a living document. Update as Motiv evolves.*

# Motiv.ai Development Blueprint

## Introduction

A comprehensive plan for developing Motiv.ai, a goal achievement platform with AI coaching, authentic social support, and health tracking integration. This document provides a detailed roadmap for implementation, beginning with a focused MVP and structured for future expansion.

> **IMPLEMENTATION GUIDE NOTICE**: Developers must continuously refer to, rigorously follow, and regularly update the Implementation Guide found in section 5 of this document. The Implementation Guide contains granular task breakdowns with checkboxes to track progress. Each feature and component should be implemented according to the steps outlined in the guide to ensure alignment with the architectural vision and desired user experience.

## 1. Product Requirements

### 1.1 Product Vision

Motiv.ai is a revolutionary personal goal achievement platform combining distinct AI coaching personalities with authentic social support and health tracking integration. The platform empowers users to select their preferred coaching style while providing robust goal management, genuine community engagement, and data-driven insights.

**Target Audience:**
- Primary: Post-college males to age 40
- Expansion: Wider demographic in future iterations

**Core Value Proposition:**
Transforming smartphones into powerful accountability partners that adapt to the user's preferred motivation style, helping users take consistent action toward their goals.

### 1.2 Core Features

#### 1.2.1 AI Coaching Personalities

Distinct AI personalities that provide consistent coaching styles aligned with user preferences.

| Requirement | Description | MVP Status |
|-------------|-------------|------------|
| Sarge Personality | Tough-love coach with direct communication, zero tolerance for excuses, unwavering belief in potential, focus on self-reliance, and emphasis on mental toughness. | Required |
| Dr. Joy Personality | Transformational coach combining empathy with standards, neuroscience-based explanations, curiosity-driven approach, balance of support and accountability, and connection of actions to values. | Future |
| Vector Personality | Systems optimization specialist with analytical communication, data-focused approach, process refinement view, efficiency-oriented solutions, and strategic iteration. | Future |
| Mental Health Safety Mechanism | System to detect negative mental states and provide appropriate support options, including suggesting professional help. | Required |

#### 1.2.2 Check-in System

Structured interaction framework for coach-user engagement at key moments throughout the day.

| Requirement | Description | MVP Status |
|-------------|-------------|------------|
| Evening Check-in | End-of-day review and next-day planning session to reflect on progress and set intentions. | Required |
| Morning Check-in | Start-of-day summary of goals and motivational content to prepare for successful day. | Required |
| Dynamic Day Check-ins | Adaptive check-ins throughout the day based on user progress and engagement with planned actions. | Required |

#### 1.2.3 Goal Management System

Comprehensive framework for setting, tracking, and modifying personal goals with coach guidance.

| Requirement | Description | MVP Status |
|-------------|-------------|------------|
| Thorough Goal-Setting Process | Guided conversation with coach to establish detailed, context-rich goals. | Required |
| Multi-layered Goal Structure | Hierarchy of high-level goals, specific metrics, and detailed daily actions. | Required |
| Coached Goal Modifications | Process requiring coach discussion for changing goals to ensure accountability. | Required |
| Progress Tracking | System for monitoring and visualizing progress toward goals. | Required |

#### 1.2.4 Authentic Social Feed

Community platform for sharing progress, providing support, and maintaining accountability.

| Requirement | Description | MVP Status |
|-------------|-------------|------------|
| AI-Generated Progress Updates | Coach-created posts based on user progress with option for review before posting. | Future |
| Community Interaction | Ability to like, comment, and engage with other users' updates. | Future |
| Privacy Controls | Options for public sharing or private circles to balance accountability and privacy. | Future |
| Challenges | Structured community activities to boost engagement and motivation. | Future |

#### 1.2.5 Content Recommendation System

Engine for delivering personalized motivational and educational content.

| Requirement | Description | MVP Status |
|-------------|-------------|------------|
| Curated Content | Company-selected high-quality resources for user motivation and education. | Future |
| AI-Scraped Content | System for finding relevant, timely content from social media and other sources. | Future |

#### 1.2.6 Health Tracking Integration

Connection to wearable devices and health apps for data-enriched coaching.

| Requirement | Description | MVP Status |
|-------------|-------------|------------|
| Apple Watch Integration | Data collection from Apple Watch for metrics like heart rate, sleep, movement, and stress. | Future |

#### 1.2.7 User Interface

Visual and interactive design of the platform.

| Requirement | Description | MVP Status |
|-------------|-------------|------------|
| Minimalist Design | Clean interface with primarily black and white color scheme plus one highlight color. | Required |
| Configurable Dashboard | User-controlled metrics display for personalized progress tracking. | Required |
| Subtle Gamification | Achievement elements that maintain minimalist aesthetic while encouraging engagement. | Required |

#### 1.2.8 Notification System

Framework for timely user alerts and engagement prompts.

| Requirement | Description | MVP Status |
|-------------|-------------|------------|
| Push Notifications | Mobile device alerts for check-ins, progress updates, and community activity. | Required |
| In-App Notifications | Internal system alerts visible when using the application. | Required |
| AI Voice Calls/Texts | Advanced re-engagement through personalized AI-generated phone calls or text messages. | Future |

### 1.3 Non-Functional Requirements

| Requirement | Description |
|-------------|-------------|
| Performance | The system must respond to user inputs within 2 seconds to maintain engagement. AI coach responses should be generated within 5 seconds. |
| Scalability | Initial MVP supports up to 100 users, with architecture designed for future scaling to thousands of users. |
| Security | User data must be encrypted in transit and at rest. Authentication system must follow industry best practices. |
| Privacy | Clear controls for what information is shared and strict limitations on coach sharing of personal conversation details. |
| Reliability | System must maintain 99.5% uptime and include data backup and recovery mechanisms. |
| Usability | Interface should be intuitive with no more than 3 clicks to access major features. First-time users should be able to set up a goal within 5 minutes. |

### 1.4 User Stories

1. As a user, I want to set up a detailed fitness goal with my AI coach so that I can have a clear, actionable plan to follow.
2. As a user, I want to receive morning and evening check-ins from my coach so that I can stay accountable to my daily actions.
3. As a user, I want to get dynamic feedback throughout the day based on my progress so that I can adjust my approach if I'm falling behind.
4. As a user, I want to modify my goal through discussion with my coach so that I can adapt to changing circumstances while maintaining accountability.
5. As a user, I want to see my progress visualized on a configurable dashboard so that I can understand how I'm advancing toward my goals.

## 2. Architecture

### 2.1 High-Level Architecture

Motiv.ai follows a client-server architecture with a focus on responsiveness, security, and scalability. The MVP will be a web-based application optimized for mobile devices, with future expansion to native iOS and Android applications.

```
[Client Layer] <-> [API Gateway] <-> [Application Layer] <-> [Data Layer]
```

### 2.2 Technology Stack

| Component | Technology | Justification |
|-----------|------------|---------------|
| Frontend | React.js | React provides a robust component-based architecture ideal for building responsive, interactive UIs. Its virtual DOM enables efficient updates, crucial for real-time progress tracking and chat interfaces. |
| Backend | Node.js with Express | Node.js offers excellent performance for real-time applications and seamless JSON handling for AI interactions. Express provides a lightweight, flexible framework for API endpoints. |
| Database | MongoDB | As a NoSQL database, MongoDB provides the flexibility needed for storing varied goal structures, user profiles, and coach interactions. Its document-based model aligns well with the JSON data flow in the application. |
| AI Integration | Anthropic API | Leveraging established AI APIs allows for rapid development of the coaching personalities without building ML infrastructure. Anthropic's API provides capabilities for natural language understanding and generation needed for the coaching experience, with strong performance in maintaining consistent personalities and contextual awareness. |
| Authentication | Firebase Authentication | Firebase provides secure, ready-to-use authentication services with support for multiple sign-in methods, reducing development time for this critical security component. |
| Hosting | Vercel (Frontend) and Heroku (Backend) | This combination offers cost-effective hosting for the MVP with easy scaling capabilities as user base grows. Vercel specializes in React deployments, while Heroku simplifies backend management. |
| Notification Service | Firebase Cloud Messaging | FCM provides reliable cross-platform notification delivery with support for both web and future mobile platforms. |

### 2.3 Data Architecture

#### 2.3.1 User

| Field | Type | Description |
|-------|------|-------------|
| userId | String | Unique identifier for the user |
| email | String | User's email address |
| name | String | User's display name |
| coachPersonality | String | Selected coach personality (Sarge for MVP) |
| created | Date | Account creation timestamp |
| lastActive | Date | Last activity timestamp |
| preferences | Object | User preferences including notification settings |
| dashboardConfig | Object | Configuration for user's customized dashboard |

#### 2.3.2 Goal

| Field | Type | Description |
|-------|------|-------------|
| goalId | String | Unique identifier for the goal |
| userId | String | Reference to goal owner |
| title | String | High-level goal description |
| description | String | Detailed goal description |
| category | String | Goal category (fitness, career, etc.) |
| createdAt | Date | Creation timestamp |
| targetDate | Date | Target completion date |
| status | String | Current goal status (active, completed, failed) |
| metrics | Array | Specific measurable aspects of the goal |
| dailyActions | Array | Detailed daily action steps |
| history | Array | Log of goal modifications and major events |
| progress | Object | Current progress data for the goal |

#### 2.3.3 CheckIn

| Field | Type | Description |
|-------|------|-------------|
| checkInId | String | Unique identifier for the check-in |
| userId | String | Reference to user |
| goalId | String | Reference to relevant goal (if specific) |
| type | String | Check-in type (morning, evening, day) |
| scheduledTime | Date | Planned check-in time |
| actualTime | Date | Actual check-in time (null if not completed) |
| status | String | Status (pending, completed, missed) |
| content | Object | Check-in content (questions, responses, etc.) |
| coachNotes | String | Private notes from coach for future interactions |

#### 2.3.4 Conversation

| Field | Type | Description |
|-------|------|-------------|
| conversationId | String | Unique identifier for conversation |
| userId | String | Reference to user |
| goalId | String | Reference to goal (if applicable) |
| checkInId | String | Reference to check-in (if applicable) |
| messages | Array | Array of message objects with sender, content, and timestamp |
| context | Object | Relevant context for the conversation |
| lastActivity | Date | Timestamp of last message |

#### 2.3.5 SocialPost

*Future feature - not in MVP*

| Field | Type | Description |
|-------|------|-------------|
| postId | String | Unique identifier for post |
| userId | String | Reference to post creator |
| goalId | String | Reference to relevant goal |
| content | String | Post text content |
| aiGenerated | Boolean | Whether post was AI-generated |
| privacyLevel | String | Public, friends, private |
| createdAt | Date | Creation timestamp |
| likes | Array | Users who liked the post |
| comments | Array | Comments on the post |

### 2.4 Component Architecture

#### 2.4.1 User Management

Handles user registration, authentication, profile management, and preferences.

**Subcomponents:**
- Authentication Service
- Profile Manager
- Preference Controller

**Interfaces:**
- UserAPI (REST)

#### 2.4.2 Coach Engine

Core AI system managing coach personalities, conversations, and coaching logic.

**Subcomponents:**
- Personality Manager
- Conversation Controller
- Context Tracker
- Mental Health Monitor

**Interfaces:**
- CoachAPI (REST/WebSocket)
- AIChatInterface (External API)

#### 2.4.3 Goal Management System

Handles creation, tracking, modification, and visualization of user goals.

**Subcomponents:**
- Goal Creator
- Progress Tracker
- Action Planner
- Visualization Engine

**Interfaces:**
- GoalAPI (REST)

#### 2.4.4 Check-in System

Manages scheduling, content generation, and processing of user check-ins.

**Subcomponents:**
- Scheduler
- Template Engine
- Response Processor
- Adaptive Timer

**Interfaces:**
- CheckInAPI (REST)

#### 2.4.5 Notification Service

Handles creation and delivery of system notifications to users.

**Subcomponents:**
- Notification Generator
- Delivery Manager
- Preference Filter

**Interfaces:**
- NotificationAPI (REST)
- PushService (External API)

#### 2.4.6 Social Platform

*Future feature - not in MVP*

Manages social interactions, content sharing, and community features.

**Subcomponents:**
- Feed Manager
- Interaction Controller
- Privacy Engine
- Challenge System

**Interfaces:**
- SocialAPI (REST)

#### 2.4.7 Content System

*Future feature - not in MVP*

Handles curation, recommendation, and delivery of motivational content.

**Subcomponents:**
- Content Curator
- Recommendation Engine
- Web Scraper

**Interfaces:**
- ContentAPI (REST)

#### 2.4.8 Health Integration

*Future feature - not in MVP*

Manages connections with health devices and processing of health data.

**Subcomponents:**
- Device Connector
- Data Processor
- Insight Generator

**Interfaces:**
- HealthAPI (REST)
- HealthKitIntegration (External API)

#### 2.4.9 Analytics Engine

Collects and processes system and user metrics for insights and improvement.

**Subcomponents:**
- Data Collector
- Metric Processor
- Report Generator

**Interfaces:**
- AnalyticsAPI (REST)

### 2.5 System Interactions

#### 2.5.1 User Registration Flow

1. User enters registration information
2. Authentication Service validates and creates account
3. Profile Manager creates initial user profile
4. Preference Controller stores default preferences
5. User is directed to onboarding process

#### 2.5.2 Goal Creation Flow

1. User initiates goal creation
2. Coach Engine guides user through detailed goal dialogue
3. Goal Creator synthesizes information into structured goal
4. Action Planner generates detailed daily action plan
5. Visualization Engine prepares initial progress display
6. Scheduler creates initial check-in schedule

#### 2.5.3 Check-in Process

1. Scheduler determines appropriate check-in time
2. Notification Service alerts user
3. Template Engine generates personalized check-in content
4. User responds to check-in prompts
5. Response Processor analyzes and stores responses
6. Coach Engine determines appropriate follow-up
7. Progress Tracker updates goal progress
8. Adaptive Timer adjusts future check-in timing

#### 2.5.4 Goal Modification Flow

1. User requests goal modification
2. Coach Engine initiates discussion about change
3. Context Tracker analyzes modification pattern
4. Goal Creator updates goal structure based on discussion
5. Action Planner adjusts daily actions
6. Scheduler adjusts check-in schedule if needed

#### 2.5.5 Mental Health Safety Response

1. Mental Health Monitor detects concerning patterns
2. Coach Engine transitions to appropriate response mode
3. User is offered support options and resources
4. Context Tracker flags situation for future awareness

### 2.6 Security Architecture

#### 2.6.1 Authentication Security

Firebase Authentication provides secure user identity verification with email/password and social login options.

#### 2.6.2 Data Security

All user data is encrypted at rest in MongoDB and in transit using TLS/SSL. Sensitive information is stored with additional encryption layers.

#### 2.6.3 API Security

All API endpoints require authentication tokens. CSRF protection, rate limiting, and input validation are implemented for all endpoints.

#### 2.6.4 Privacy Controls

Granular user controls for what information is shared socially versus kept private between user and coach.

### 2.7 Scalability Plan

#### 2.7.1 Horizontal Scaling

The Node.js backend can be horizontally scaled through additional instances behind a load balancer to accommodate growing user base.

#### 2.7.2 Database Scaling

MongoDB can be scaled through sharding as data volume increases. Initial implementation uses MongoDB Atlas for managed scaling.

#### 2.7.3 Caching Strategy

Redis implementation for caching frequent data access patterns such as user profiles, active goals, and coach context.

## 3. Implementation Guide

### 3.1 MVP Implementation Plan

The MVP implementation focuses on delivering core functionality for the Sarge coach personality, goal management, check-in system, and minimalist UI within a 1-2 week timeframe for up to 100 users.

#### 3.1.1 Project Setup

- [x] Initialize Git repository for version control
  - [x] Create main repository with appropriate .gitignore
  - [ ] Configure branch protection for main branch
  - [ ] Set up GitHub Actions for CI/CD

- [x] Create frontend React application
  - [x] Initialize React project using Create React App
  - [x] Set up folder structure (components, pages, services, utils)
  - [x] Configure ESLint and Prettier for code quality
  - [x] Install core dependencies (React Router, Axios, styled-components)

- [x] Create backend Node.js application
  - [x] Initialize Node.js project with Express
  - [x] Set up folder structure (routes, controllers, services, models)
  - [x] Configure ESLint and Prettier for code quality
  - [x] Install core dependencies (mongoose, cors, helmet, dotenv)

- [x] Set up MongoDB database
  - [x] Create MongoDB Atlas account (or local MongoDB instance)
  - [x] Configure database connection in backend
  - [x] Test connection functionality

- [x] Configure Firebase services
  - [x] Create Firebase project
  - [x] Set up Firebase Authentication
  - [x] Configure Firebase Cloud Messaging for notifications
  - [x] Add Firebase SDK to frontend and backend

- [x] Set up Anthropic API integration
  - [x] Create Anthropic API account
  - [x] Create secure API key management strategy
  - [x] Create test integration to verify connectivity

#### 3.1.2 User Management Implementation

- [x] Implement authentication system
  - [x] Create user authentication API endpoints (signup, login, logout)
  - [x] Set up Firebase Authentication integration
  - [x] Implement JWT token strategy for API security
  - [x] Build frontend authentication forms
  - [x] Create protected route mechanism

- [x] Implement user profile management
  - [x] Create User model in MongoDB
  - [x] Build profile management API endpoints
  - [ ] Create frontend profile management interface
  - [x] Implement profile setup during onboarding

- [x] Implement user preferences system
  - [x] Create preference storage in User model
  - [x] Build preference management API endpoints
  - [ ] Create frontend preference management interface
  - [x] Implement notification preferences options

#### 3.1.3 Coach Engine Implementation

- [x] Design Sarge personality profile
  - [x] Define detailed personality characteristics and tone
  - [x] Create coaching response templates for common scenarios
  - [x] Develop conversation flow patterns for various user states
  - [x] Document response patterns for Anthropic prompt engineering

- [x] Implement conversation manager
  - [x] Create Conversation model in MongoDB
  - [x] Build conversation API endpoints
  - [x] Implement context management for ongoing conversations
  - [ ] Create frontend chat interface

- [x] Implement Anthropic API integration for coach responses
  - [x] Create prompt engineering system for Sarge personality
  - [x] Build Anthropic request/response handler
  - [ ] Implement caching strategy to reduce API calls
  - [ ] Create fallback systems for API unavailability

- [x] Implement mental health safety system
  - [x] Define trigger patterns and keywords
  - [x] Create detection algorithm for negative states
  - [x] Design appropriate intervention responses
  - [x] Implement resource suggestions for professional help

#### 3.1.4 Goal Management Implementation

- [x] Implement goal creation system
  - [x] Create Goal model in MongoDB
  - [x] Build goal creation API endpoints
  - [x] Design guided goal creation conversation flow
  - [x] Implement categorization and tagging system
  - [x] Create frontend goal creation interface

- [x] Implement goal structure components
  - [x] Build high-level goal management
  - [x] Implement specific metrics tracking
  - [x] Create daily action plan system
  - [x] Develop goal modification process

- [x] Implement progress tracking
  - [x] Create progress data structure
  - [x] Build progress update API endpoints
  - [x] Implement milestone detection
  - [x] Create frontend progress visualization components

- [x] Implement goal analytics
  - [x] Create goal statistics calculations
  - [x] Build goal analytics API endpoints
  - [x] Implement trend detection
  - [x] Create frontend analytics display

> **Note:** The frontend is now fully integrated with the backend for all goal operations (create, fetch, update, progress). LocalStorage persistence has been removed.

#### 3.1.5 Check-in System Implementation

- [ ] Implement check-in scheduling system
  - [x] Create CheckIn model in MongoDB
  - [x] Build scheduler service for creating check-ins
  - [x] Implement morning/evening check-in templates
  - [x] Create dynamic check-in generator for day check-ins

- [x] Implement adaptive timing system
  - [x] Create user behavior tracking mechanism
  - [x] Build algorithm for optimal timing prediction
  - [x] Implement check-in frequency adjustment based on goal progress

- [ ] Implement check-in UI components
  - [x] Create check-in notification display
  - [x] Build check-in response interface
  - [ ] Implement check-in history view
  - [ ] Create missed check-in handling

- [ ] Implement check-in content generation
  - [ ] Create morning check-in content templates
  - [ ] Build evening check-in content templates
  - [ ] Implement dynamic day check-in content generation
  - [ ] Create personalized response analysis

#### 3.1.6 UI/UX Implementation

- [ ] Create minimalist design system
  - [ ] Define color palette (black, white, one highlight color)
  - [ ] Create typography system
  - [ ] Build component library with consistent styling
  - [ ] Implement responsive design patterns

- [ ] Implement configurable dashboard
  - [ ] Create dashboard layout framework
  - [ ] Build customization interface
  - [ ] Implement widget components for different metrics
  - [ ] Create persistence for dashboard configuration

- [ ] Implement subtle gamification elements
  - [ ] Design achievement system
  - [ ] Create streak tracking mechanism
  - [ ] Build visual rewards that maintain minimalist aesthetic
  - [ ] Implement progress milestone celebrations

- [ ] Create mobile-optimized responsive interface
  - [ ] Implement responsive layout system
  - [ ] Optimize touch interactions for mobile
  - [ ] Test and refine on multiple device sizes
  - [ ] Ensure all features work properly on mobile browsers

#### 3.1.7 Notification System Implementation

- [ ] Implement push notification service
  - [ ] Set up Firebase Cloud Messaging
  - [ ] Create notification permission flow
  - [ ] Build notification sending service
  - [ ] Implement notification templates for different scenarios

- [ ] Implement in-app notification system
  - [ ] Create notification center UI
  - [ ] Build notification storage mechanism
  - [ ] Implement real-time notification updates
  - [ ] Create notification actions and deep linking

- [ ] Implement notification preferences
  - [ ] Create user notification settings interface
  - [ ] Build preference storage system
  - [ ] Implement notification filtering based on preferences
  - [ ] Create notification scheduling controls

#### 3.1.8 Testing

- [ ] Implement unit testing
  - [ ] Create unit tests for backend services
  - [ ] Implement unit tests for frontend components
  - [ ] Set up automated test running in CI/CD

- [ ] Implement integration testing
  - [ ] Create API integration tests
  - [ ] Implement frontend integration tests
  - [ ] Test third-party service integrations

- [ ] Conduct user acceptance testing
  - [ ] Create testing protocols for core user flows
  - [ ] Recruit test users matching target demographic
  - [ ] Document and prioritize feedback
  - [ ] Implement critical fixes

#### 3.1.9 Deployment

- [ ] Deploy frontend to Vercel
  - [ ] Configure Vercel project settings
  - [ ] Set up environment variables
  - [ ] Configure custom domain (if applicable)
  - [ ] Test deployed application

- [ ] Deploy backend to Heroku
  - [ ] Configure Heroku project settings
  - [ ] Set up environment variables
  - [ ] Configure MongoDB connection
  - [ ] Test deployed API endpoints

- [ ] Configure monitoring and logging
  - [ ] Set up error tracking (Sentry)
  - [ ] Configure performance monitoring
  - [ ] Implement usage analytics
  - [ ] Create alert system for critical issues

### 3.2 Example Implementations

#### 3.2.1 Sarge Personality Implementation

Example prompt engineering for creating the Sarge coach personality in Anthropic API.

```javascript
// Coach personality prompt constructor for Anthropic API
function buildSargePrompt(user, context, userMessage) {
  return {
    messages: [
      {
        role: "system",
        content: `You are Sarge, a tough-love AI coach focused on helping users achieve their goals through:
        
        - Direct, blunt communication with strategic profanity (occasional, for emphasis)
        - Zero tolerance for excuses and victim mentality
        - Unwavering belief in human potential
        - Focus on self-reliance and personal accountability
        - Emphasis on mental toughness and pushing beyond perceived limitations
        
        Respond as Sarge, maintaining your tough-love personality while genuinely helping the user progress toward their goal. 
        Use concise paragraphs, occasional strategic profanity (sparingly), and direct call-outs of any excuse patterns.
        Always reinforce personal accountability and emphasize that the user is capable of more than they believe.
        
        If the user appears to be in a negative mental state (expressing thoughts of self-harm, extreme depression, or hopelessness),
        briefly acknowledge their feelings, suggest professional mental health support, and ask if they'd like to speak with a 
        different coach personality.`
      },
      {
        role: "user",
        content: `USER CONTEXT:
        Name: ${user.name}
        Current Goal: ${context.currentGoal.title}
        Goal Description: ${context.currentGoal.description}
        Current Progress: ${context.currentGoal.progress}
        Recent Challenges: ${context.recentChallenges}
        Previous Excuses: ${context.previousExcuses}
        
        CONVERSATION HISTORY:
        ${context.conversationHistory}
        
        USER'S LATEST MESSAGE:
        ${userMessage}`
      }
    ],
    model: "claude-3-sonnet-20240229",
    max_tokens: 1000
  };
}
```

#### 3.2.2 Check-in System Implementation

Example code for implementing the dynamic check-in scheduling system.

```javascript
// Check-in scheduler service
class CheckInScheduler {
  constructor(userService, goalService, notificationService) {
    this.userService = userService;
    this.goalService = goalService;
    this.notificationService = notificationService;
  }
  
  // Schedule morning check-in
  async scheduleMorningCheckIn(userId) {
    const user = await this.userService.getUser(userId);
    const userPreferences = user.preferences;
    const activeGoals = await this.goalService.getActiveGoals(userId);
    
    // Calculate optimal morning time based on user preference and past engagement
    const checkInTime = this.calculateOptimalMorningTime(userPreferences);
    
    // Create check-in content based on goals and previous evening planning
    const content = await this.generateMorningContent(activeGoals);
    
    // Create check-in record in database
    const checkIn = await this.createCheckIn({
      userId,
      type: 'morning',
      scheduledTime: checkInTime,
      status: 'pending',
      content,
      goals: activeGoals.map(goal => goal.id)
    });
    
    // Schedule notification
    await this.notificationService.scheduleNotification({
      userId,
      title: 'Morning Check-in with Sarge',
      body: 'Time to review your day plan and get moving!',
      scheduledTime: checkInTime,
      data: {
        type: 'check-in',
        checkInId: checkIn.id
      }
    });
    
    return checkIn;
  }
  
  // Calculate optimal check-in time based on user behavior patterns
  calculateOptimalMorningTime(userPreferences) {
    // Default to user's preferred morning time
    let preferredTime = userPreferences.morningCheckInTime || '08:00';
    
    // Adjust based on historical engagement data if available
    if (userPreferences.engagementHistory && userPreferences.engagementHistory.length > 0) {
      // Algorithm to find optimal time based on when user is most responsive
      // ...implementation...
    }
    
    // Convert to Date object for today
    const now = new Date();
    const [hours, minutes] = preferredTime.split(':');
    const checkInTime = new Date(now);
    checkInTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    
    // If the time has already passed today, schedule for tomorrow
    if (checkInTime < now) {
      checkInTime.setDate(checkInTime.getDate() + 1);
    }
    
    return checkInTime;
  }
  
  // Generate personalized morning check-in content
  async generateMorningContent(activeGoals) {
    // Compile goal information for the day
    const goalSummaries = activeGoals.map(goal => {
      return {
        title: goal.title,
        dailyActions: goal.dailyActions.filter(action => action.scheduledForToday),
        metrics: goal.metrics
      };
    });
    
    // Format content for coach presentation
    return {
      intro: "Here's your game plan for today, soldier!",
      goalSummaries,
      motivationalQuote: await this.getRandomMotivationalQuote()
    };
  }
  
  // Create dynamic day check-ins based on goal progress
  async scheduleDynamicDayCheckIns(userId) {
    const activeGoals = await this.goalService.getActiveGoals(userId);
    const scheduledCheckIns = [];
    
    for (const goal of activeGoals) {
      // For each goal with actions scheduled for today
      const todaysActions = goal.dailyActions.filter(action => action.scheduledForToday);
      
      for (const action of todaysActions) {
        // If the action has a specific time and needs a check-in
        if (action.scheduledTime && action.requiresCheckIn) {
          // Schedule check-in shortly after action should be completed
          const checkInTime = new Date(action.scheduledTime);
          checkInTime.setMinutes(checkInTime.getMinutes() + 15);
          
          // Create check-in content specific to this action
          const content = await this.generateActionCheckInContent(goal, action);
          
          // Create check-in record
          const checkIn = await this.createCheckIn({
            userId,
            type: 'day',
            scheduledTime: checkInTime,
            status: 'pending',
            content,
            goals: [goal.id],
            relatedAction: action.id
          });
          
          // Schedule notification
          await this.notificationService.scheduleNotification({
            userId,
            title: `Check-in: ${action.title}`,
            body: 'Time to report on your progress!',
            scheduledTime: checkInTime,
            data: {
              type: 'check-in',
              checkInId: checkIn.id
            }
          });
          
          scheduledCheckIns.push(checkIn);
        }
      }
    }
    
    return scheduledCheckIns;
  }
  
  // Internal method to create check-in in database
  async createCheckIn(checkInData) {
    // Implementation to save to database
    // ...
    return checkInData;
  }
}
```

#### 3.2.3 Goal Management Implementation

Example React component for goal creation interface.

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { CoachChat } from '../components/CoachChat';
import { Button } from '../components/Button';
import { GoalForm } from '../components/GoalForm';
import { useGoalService } from '../services/goalService';
import { useCoachService } from '../services/coachService';

const GoalCreationContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const Step = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.active ? props.theme.highlightColor : '#fff'};
  color: ${props => props.active ? '#fff' : '#000'};
  border: 1px solid ${props => props.completed ? props.theme.highlightColor : '#ccc'};
`;

const StepConnector = styled.div`
  flex-grow: 1;
  height: 2px;
  background-color: ${props => props.completed ? props.theme.highlightColor : '#ccc'};
  align-self: center;
  margin: 0 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

// Goal creation process with coach guidance
export const GoalCreationPage = () => {
  const navigate = useNavigate();
  const goalService = useGoalService();
  const coachService = useCoachService();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [goalData, setGoalData] = useState({
    title: '',
    description: '',
    category: '',
    targetDate: '',
    metrics: [],
    dailyActions: []
  });
  const [chatHistory, setChatHistory] = useState([]);
  
  // Initialize conversation with coach
  useEffect(() => {
    const startConversation = async () => {
      const initialMessage = await coachService.getInitialGoalMessage();
      setChatHistory([
        {
          sender: 'coach',
          content: initialMessage,
          timestamp: new Date()
        }
      ]);
    };
    
    startConversation();
  }, []);
  
  // Handle user message to coach
  const handleSendMessage = async (message) => {
    // Add user message to chat
    setChatHistory(prev => [
      ...prev,
      {
        sender: 'user',
        content: message,
        timestamp: new Date()
      }
    ]);
    
    // Get coach response
    const coachResponse = await coachService.getGoalCreationResponse(message, {
      currentStep,
      goalData,
      chatHistory
    });
    
    // Add coach response to chat
    setChatHistory(prev => [
      ...prev,
      {
        sender: 'coach',
        content: coachResponse.message,
        timestamp: new Date()
      }
    ]);
    
    // Update goal data if coach extracted relevant information
    if (coachResponse.extractedData) {
      setGoalData(prev => ({
        ...prev,
        ...coachResponse.extractedData
      }));
    }
    
    // Coach may suggest moving to next step
    if (coachResponse.suggestNextStep) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };
  
  // Handle direct form input for goal data
  const handleGoalDataChange = (updatedData) => {
    setGoalData(prev => ({
      ...prev,
      ...updatedData
    }));
  };
  
  // Move to next step in creation process
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmitGoal();
    }
  };
  
  // Move to previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Final submission of goal
  const handleSubmitGoal = async () => {
    try {
      // Create goal in system
      const createdGoal = await goalService.createGoal(goalData);
      
      // Navigate to goal detail page
      navigate(`/goals/${createdGoal.id}`);
    } catch (error) {
      console.error('Error creating goal:', error);
      // Handle error state
    }
  };
  
  // Render appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2>Step 1: Define Your Goal</h2>
            <p>Chat with your coach to define your high-level goal and target.</p>
            <CoachChat
              chatHistory={chatHistory}
              onSendMessage={handleSendMessage}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Step 2: Set Specific Metrics</h2>
            <p>Establish measurable outcomes that define success.</p>
            <GoalForm
              type="metrics"
              goalData={goalData}
              onChange={handleGoalDataChange}
            />
            <CoachChat
              chatHistory={chatHistory}
              onSendMessage={handleSendMessage}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Step 3: Create Daily Action Plan</h2>
            <p>Define the specific actions you'll take each day.</p>
            <GoalForm
              type="dailyActions"
              goalData={goalData}
              onChange={handleGoalDataChange}
            />
            <CoachChat
              chatHistory={chatHistory}
              onSendMessage={handleSendMessage}
            />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <GoalCreationContainer>
      <h1>Create New Goal</h1>
      
      <StepIndicator>
        <Step active={currentStep === 1} completed={currentStep > 1}>1</Step>
        <StepConnector completed={currentStep > 1} />
        <Step active={currentStep === 2} completed={currentStep > 2}>2</Step>
        <StepConnector completed={currentStep > 2} />
        <Step active={currentStep === 3} completed={currentStep > 3}>3</Step>
      </StepIndicator>
      
      {renderStepContent()}
      
      <ButtonContainer>
        {currentStep > 1 && (
          <Button onClick={handlePrevStep}>Previous</Button>
        )}
        <Button 
          primary 
          onClick={handleNextStep}
          disabled={
            (currentStep === 1 && (!goalData.title || !goalData.description)) ||
            (currentStep === 2 && goalData.metrics.length === 0) ||
            (currentStep === 3 && goalData.dailyActions.length === 0)
          }
        >
          {currentStep < 3 ? 'Next' : 'Create Goal'}
        </Button>
      </ButtonContainer>
    </GoalCreationContainer>
  );
};
```

### 3.3 Future Implementation Plan

Roadmap for implementing features beyond the MVP, organized by priority.

#### 3.3.1 Phase 1: Additional Coach Personalities

- [ ] Implement Dr. Joy personality
  - [ ] Define detailed personality characteristics
  - [ ] Create response templates and conversation patterns
  - [ ] Implement prompt engineering for Anthropic API
  - [ ] Test personality consistency across scenarios

- [ ] Implement Vector personality
  - [ ] Define detailed personality characteristics
  - [ ] Create response templates and conversation patterns
  - [ ] Implement prompt engineering for Anthropic API
  - [ ] Test personality consistency across scenarios

- [ ] Create coach selection experience
  - [ ] Design coach comparison interface
  - [ ] Implement sample interactions
  - [ ] Create coach switching mechanism
  - [ ] Implement coach personality persistence

#### 3.3.2 Phase 2: Social Features

- [ ] Implement social feed
  - [ ] Create SocialPost model
  - [ ] Build social feed API endpoints
  - [ ] Implement post creation interface
  - [ ] Create feed display with infinite scrolling

- [ ] Implement AI-generated progress posts
  - [ ] Create post generation algorithm
  - [ ] Build user review and editing interface
  - [ ] Implement automatic posting option
  - [ ] Develop engagement analytics for posts

- [ ] Implement social interactions
  - [ ] Create like functionality
  - [ ] Build comment system
  - [ ] Implement notification system for interactions
  - [ ] Create privacy controls for interactions

- [ ] Implement challenges
  - [ ] Create Challenge model
  - [ ] Build challenge creation and joining system
  - [ ] Implement progress tracking for challenges
  - [ ] Create challenge leaderboards

#### 3.3.3 Phase 3: Content Recommendation System

- [ ] Implement content curation system
  - [ ] Create Content model
  - [ ] Build content management interface
  - [ ] Implement content categorization
  - [ ] Create content scheduling system

- [ ] Implement AI content scraping
  - [ ] Build social media scraping service
  - [ ] Implement content filtering and quality assessment
  - [ ] Create storage system for scraped content
  - [ ] Develop source attribution mechanism

- [ ] Implement personalized recommendation engine
  - [ ] Create user interest tracking
  - [ ] Build recommendation algorithm
  - [ ] Implement feedback mechanism for recommendations
  - [ ] Create content delivery system

#### 3.3.4 Phase 4: Health Tracking Integration

- [ ] Implement Apple Watch integration
  - [ ] Research HealthKit API requirements
  - [ ] Implement data collection service
  - [ ] Create data processing and analysis
  - [ ] Build visualization components

- [ ] Implement health insights
  - [ ] Create correlation analysis between health data and goals
  - [ ] Build pattern detection algorithms
  - [ ] Implement recommendation engine based on health data
  - [ ] Create health insight presentation

#### 3.3.5 Phase 5: Native Mobile Apps

- [ ] Implement iOS application
  - [ ] Convert React web app to React Native
  - [ ] Implement iOS-specific features
  - [ ] Create native notification handling
  - [ ] Optimize performance for iOS devices

- [ ] Implement Android application
  - [ ] Adapt iOS React Native app for Android
  - [ ] Implement Android-specific features
  - [ ] Create native notification handling
  - [ ] Optimize performance for Android devices

#### 3.3.6 Phase 6: Advanced Engagement Features

- [ ] Implement AI voice calls/texts
  - [ ] Research voice synthesis technology
  - [ ] Implement voice generation service
  - [ ] Create text-to-voice conversion
  - [ ] Build call scheduling and delivery system

- [ ] Implement advanced analytics
  - [ ] Create comprehensive analytics dashboard
  - [ ] Build predictive analytics for goal success
  - [ ] Implement personal insights generation
  - [ ] Create benchmarking against similar users

## 4. Coding Standards

### 4.1 Code Organization

All code should be organized into logical modules with clear separation of concerns. Frontend code should follow a component-based architecture with reusable UI elements. Backend code should follow the MVC pattern with additional service layers for business logic.

### 4.2 Naming Conventions

Use camelCase for variables and functions, PascalCase for classes and components, and kebab-case for file names. Constants should use UPPER_SNAKE_CASE. Names should be descriptive and reveal intent.

### 4.3 Error Handling

All errors should be properly caught and handled. Use try/catch blocks for asynchronous operations. API endpoints should return appropriate HTTP status codes and error messages. Frontend should display user-friendly error messages.

### 4.4 Testing

All code should have appropriate unit tests. Critical paths should have integration tests. UI components should have snapshot tests. Aim for minimum 80% test coverage.

### 4.5 Code Commenting

Code must include a higher-than-typical density of comments. Comments should explain the 'why' behind complex logic, document non-obvious behaviors, and clarify the purpose of functions, classes, and modules extensively. Each component and function should have JSDoc style documentation.

**Example:**

```javascript
/**
 * Calculates the optimal check-in time based on user preferences and historical engagement patterns.
 * 
 * The algorithm prioritizes:
 * 1. User's explicit time preference if set
 * 2. Historical engagement data showing when user is most responsive
 * 3. Default times based on check-in type
 * 
 * We avoid scheduling during detected sleep hours and ensure check-ins aren't too close together
 * to prevent notification fatigue.
 * 
 * @param {Object} userPreferences - User's stored preferences
 * @param {string} checkInType - Type of check-in (morning, evening, day)
 * @param {Array} previousCheckIns - History of user's check-in interactions
 * @returns {Date} The calculated optimal time for the check-in
 */
function calculateOptimalCheckInTime(userPreferences, checkInType, previousCheckIns) {
  // Implementation...
}
```

### 4.6 Performance

Code should be optimized for performance. Use memoization for expensive calculations, virtualization for long lists, and pagination for large data sets. Minimize unnecessary re-renders in React. Use appropriate indexes in MongoDB.

### 4.7 Security

Follow security best practices. Validate all user inputs. Protect against common vulnerabilities (XSS, CSRF, injection). Use proper authentication and authorization. Never expose sensitive information in logs or client-side code.
