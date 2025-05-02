export interface DocumentEditorProps {
  name: string;
  value: string;
  onChange?: (value: string) => void;
  hideFooter?: boolean;
  loading?: boolean;
}
