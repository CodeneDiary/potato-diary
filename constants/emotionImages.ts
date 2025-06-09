export type EmotionType =
  | "happy"
  | "sad"
  | "calm"
  | "angry"
  | "neutral"
  | "anxious";

export const emotionImages: Record<EmotionType, any> = {
  happy: require("@/assets/images/emotion-happy.png"),
  sad: require("@/assets/images/emotion-sad.png"),
  calm: require("@/assets/images/emotion-calm.png"),
  angry: require("@/assets/images/emotion-angry.png"),
  neutral: require("@/assets/images/emotion-neutral.png"),
  anxious: require("@/assets/images/emotion-anxious.png"),
};
