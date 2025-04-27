import { TDocAIActions } from "./constants";

const generateImproveItPrompt = (text: string) => {
  return `Improve the following text by enhancing clarity, style, and flow while maintaining the original meaning. Avoid adding introductions or conclusions. Output only the improved text:
"${text}"`;
};

const generateShortenPrompt = (text: string) => {
  return `Rewrite the following text to be significantly shorter and more concise, without losing important meaning. Avoid introductions or conclusions. Output only the shortened version:
"${text}"`;
};

const generateSimplifyPrompt = (text: string) => {
  return `Simplify the following text to be easily understood by a general audience. Use clear, plain language without dumbing down the meaning. Do not add introductions or conclusions. Output only the simplified text:
"${text}"`;
};

const generateDetailedPrompt = (text: string) => {
  return `Expand the following text with more detailed explanations, examples, and descriptions where appropriate. Keep the original intent but add richness and depth. Avoid adding introductions or conclusions. Output only the detailed version:
"${text}"`;
};

const generateParaphrasePrompt = (text: string) => {
  return `Paraphrase the following text to express the same ideas in a fresh and natural way. Maintain the original meaning without adding introductions, conclusions, or personal opinions. Output only the paraphrased text:
"${text}"`;
};

const generateFluentPrompt = (text: string) => {
  return `Rewrite the following text to make it sound fluent, natural, and polished as if written by a native speaker. Avoid introductions or conclusions. Output only the fluent version:
"${text}"`;
};

const generateAnticipatoryTonePrompt = (text: string) => {
  return `Adjust the tone of the following text to sound anticipatory and forward-looking. Reflect excitement or eagerness about upcoming possibilities. Keep the content intact. Output only the tone-adjusted text:
"${text}"`;
};

const generateAssertiveTonePrompt = (text: string) => {
  return `Adjust the tone of the following text to be assertive, confident, and decisive without being aggressive. Maintain professionalism and the original message. Output only the tone-adjusted text:
"${text}"`;
};

const generateCompassionateTonePrompt = (text: string) => {
  return `Rewrite the following text with a compassionate and empathetic tone. Convey understanding, kindness, and support while keeping the original content. Output only the tone-adjusted text:
"${text}"`;
};

const generateConfidentTonePrompt = (text: string) => {
  return `Adjust the tone of the following text to sound confident, self-assured, and credible. Avoid overstatements or arrogance. Maintain the original meaning. Output only the tone-adjusted text:
"${text}"`;
};

const generateConstructiveTonePrompt = (text: string) => {
  return `Rewrite the following text with a constructive and solution-oriented tone. Focus on positive language that encourages improvement or action. Preserve the original meaning. Output only the tone-adjusted text:
"${text}"`;
};

const generateCustomPrompt = (text: string, customPrompt?: string) => {
  return `${customPrompt}. Avoid adding introductions or conclusions. Output only the text:
"${text}"`;
};

export const PROMPT_GENERATORS = {
  [TDocAIActions.IMPROVE]: generateImproveItPrompt,
  [TDocAIActions.SHORTEN]: generateShortenPrompt,
  [TDocAIActions.SIMPLIFY]: generateSimplifyPrompt,
  [TDocAIActions.DETAILED]: generateDetailedPrompt,
  [TDocAIActions.PARAPHRASE]: generateParaphrasePrompt,
  [TDocAIActions.FLUENT]: generateFluentPrompt,
  [TDocAIActions.ANTICIPATORY]: generateAnticipatoryTonePrompt,
  [TDocAIActions.ASSERTIVE]: generateAssertiveTonePrompt,
  [TDocAIActions.COMPASSIONATE]: generateCompassionateTonePrompt,
  [TDocAIActions.CONFIDENT]: generateConfidentTonePrompt,
  [TDocAIActions.CONSTRUCTIVE]: generateConstructiveTonePrompt,
  [TDocAIActions.CUSTOM_PROMPT]: generateCustomPrompt,
} as const;
