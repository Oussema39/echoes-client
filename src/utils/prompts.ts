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
  return `Improve the following text by adding only essential clarifications or brief examples where helpful. Keep the original meaning and tone. Be concise — avoid excessive elaboration or unnecessary length. Do not add an introduction or conclusion. Return only the revised text:
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

export const generateStructuredHtmlPrompt = (
  text: string,
  customPrompt: string
) => {
  return `
You are an AI that outputs ONLY valid HTML fragments for use inside a React Quill editor.

Strict rules:
- Do NOT include <!DOCTYPE>, <html>, <head>, <body>, <style>, or <script>.
- Start output strictly with <h1>.
- Use ONLY Quill-compatible tags: <p>, <h1>-<h6>, <ul>, <ol>, <li>, <strong>, <em>, <u>, <blockquote>, <a>, <code>.
- All tags MUST be properly closed.

### Allowed Quill classes
- **Font and Size**: ql-font-serif, ql-font-monospace, ql-size-small, ql-size-large, ql-size-huge
- **Color and Background**: ql-color-white, ql-color-red, ql-color-orange, ql-color-yellow, ql-color-green, ql-color-blue, ql-color-purple; ql-bg-black, ql-bg-red, ql-bg-orange, ql-bg-yellow, ql-bg-green, ql-bg-blue, ql-bg-purple
- **Alignment and Direction**: ql-align-left, ql-align-center, ql-align-right, ql-align-justify; ql-direction-rtl
- **Lists and Indentation**: ql-indent-1 through ql-indent-9; li[data-list="ordered"], li[data-list="bullet"], li[data-list="checked"], li[data-list="unchecked"]
- **Other Text-Related Styles**: ql-editor, ql-blank; h1-h6, a, blockquote, code, ql-code-block-container, ql-video

Do NOT use any other classes or inline styles.

### Task:
${customPrompt}

${
  text?.length > 0
    ? `
### Reference:
Use this document as inspiration and expand upon it with more detail:
${text}
`
    : ""
}

### Output Requirements:
- Length: 600-1200 words (moderately long).
- At least 6-10 <h2> sections with content.
- At least 2 <h3> subsections spread under different <h2> sections.
- Each section must have 2-3 paragraphs of 3-5 sentences.
- Include at least 2 <ul> lists and 2 <ol> lists across the document.
- Use <strong>, <em>, <u>, and allowed Quill classes for emphasis and styling throughout.
- **Smart Styling**: Vary fonts, sizes, colors, alignment, background, indentation, and list types throughout the document for readability and visual hierarchy.
- **Content Quality**: Provide clear, actionable, and valuable information; use examples, step-by-step instructions, and summaries where appropriate.
- Balance narrative, lists, and visual emphasis; avoid repetition.
- Ensure output is valid HTML that can be directly parsed into Quill.

### Structure Template (follow closely):

<h1 class="ql-align-center ql-size-huge ql-font-serif ql-color-blue">[Main Title]</h1>

<h2 class="ql-align-left ql-size-large ql-color-red">[Section Title]</h2>
<p class="ql-size-large ql-font-serif ql-color-green">[3-5 sentences of explanatory text]</p>
<ul>
  <li class="ql-indent-1">[Item 1]</li>
  <li class="ql-indent-2">[Item 2]</li>
</ul>

<h2 class="ql-align-right ql-size-large ql-color-purple">[Next Section]</h2>
<p>[3-5 sentences of explanatory text]</p>
<ol>
  <li class="ql-indent-1">[Step 1]</li>
  <li class="ql-indent-2">[Step 2]</li>
</ol>

<h3 class="ql-size-small ql-font-monospace ql-color-orange">[Subsection]</h3>
<p>[3-5 sentences expanding on this idea]</p>

<!-- Continue until the document is fully developed -->
`.trim();
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
  [TDocAIActions.CUSTOM_PROMPT]: generateStructuredHtmlPrompt,
} as const;
