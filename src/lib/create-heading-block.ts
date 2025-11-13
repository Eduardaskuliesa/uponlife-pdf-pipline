export function Heading(this: any, question_id: string, text: string) {
  this.type = "heading";
  this.question_id = question_id;
  this.text = text;
}
