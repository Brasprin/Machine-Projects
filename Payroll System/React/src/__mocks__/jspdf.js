export default function jsPDF() {
  return {
    text: jest.fn(),
    save: jest.fn(),
    addImage: jest.fn(),
  };
}