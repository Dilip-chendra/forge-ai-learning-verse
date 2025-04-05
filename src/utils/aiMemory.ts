
import { Message } from "@/types/aiTutor";

// A simple in-memory store for the AI's memory
// In a production app, this would be persisted to a database
class AiMemoryManager {
  private memories: {
    messages: Message[];
    uploadedResources: {
      id: string;
      type: 'document' | 'image' | 'audio' | 'video';
      name: string;
      url: string;
      content?: string; // For text extraction from documents
      createdAt: Date;
    }[];
    learningTopics: {
      id: string;
      name: string;
      lastStudied: Date;
      proficiency: number; // 0-100 scale
    }[];
  } = {
    messages: [],
    uploadedResources: [],
    learningTopics: [],
  };

  constructor() {
    // Load from localStorage for persistence between sessions
    const savedMemory = localStorage.getItem('ai-tutor-memory');
    if (savedMemory) {
      try {
        const parsed = JSON.parse(savedMemory);
        // Convert string dates back to Date objects
        if (parsed.messages) {
          parsed.messages.forEach((msg: any) => {
            msg.timestamp = new Date(msg.timestamp);
          });
        }
        if (parsed.uploadedResources) {
          parsed.uploadedResources.forEach((resource: any) => {
            resource.createdAt = new Date(resource.createdAt);
          });
        }
        if (parsed.learningTopics) {
          parsed.learningTopics.forEach((topic: any) => {
            topic.lastStudied = new Date(topic.lastStudied);
          });
        }
        this.memories = parsed;
      } catch (e) {
        console.error("Failed to load AI memory from localStorage", e);
      }
    }
  }

  // Save the current state to localStorage
  private save() {
    localStorage.setItem('ai-tutor-memory', JSON.stringify(this.memories));
  }

  // Add a new message to memory
  addMessage(message: Message) {
    this.memories.messages.push(message);
    this.save();
    return message;
  }

  // Get all messages
  getMessages(): Message[] {
    return [...this.memories.messages];
  }

  // Add an uploaded resource
  addResource(resource: {
    id: string;
    type: 'document' | 'image' | 'audio' | 'video';
    name: string;
    url: string;
    content?: string;
  }) {
    this.memories.uploadedResources.push({
      ...resource,
      createdAt: new Date(),
    });
    this.save();
    return resource;
  }

  // Get all resources
  getResources() {
    return [...this.memories.uploadedResources];
  }

  // Get recent interactions as a summary for context
  getContextSummary(limit = 10): string {
    const recentMessages = this.memories.messages
      .slice(-limit)
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');
    
    const topResources = this.memories.uploadedResources
      .slice(-5)
      .map(res => `${res.type}: ${res.name}`)
      .join('\n');
    
    return `Recent conversation:\n${recentMessages}\n\nRecent resources:\n${topResources}`;
  }

  // Track a new learning topic or update an existing one
  updateLearningTopic(topicName: string, proficiencyDelta = 5) {
    const existingTopic = this.memories.learningTopics.find(t => t.name === topicName);
    
    if (existingTopic) {
      existingTopic.lastStudied = new Date();
      existingTopic.proficiency = Math.min(100, Math.max(0, existingTopic.proficiency + proficiencyDelta));
    } else {
      this.memories.learningTopics.push({
        id: Date.now().toString(),
        name: topicName,
        lastStudied: new Date(),
        proficiency: 10, // Starting proficiency
      });
    }
    
    this.save();
  }

  // Get learning topics sorted by recent activity
  getLearningTopics() {
    return [...this.memories.learningTopics].sort((a, b) => 
      b.lastStudied.getTime() - a.lastStudied.getTime()
    );
  }

  // Clear all memory
  clearMemory() {
    this.memories = {
      messages: [],
      uploadedResources: [],
      learningTopics: [],
    };
    this.save();
  }
}

// Export a singleton instance
export const aiMemory = new AiMemoryManager();
