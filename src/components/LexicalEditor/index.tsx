import { SettingsContext } from "./context/SettingsContext";
import { FullEditorFeatures } from "./LexicalEditor";

const LexicalEditor = () => {
  return (
    <SettingsContext>
      <FullEditorFeatures />
    </SettingsContext>
  );
};

export default LexicalEditor;
