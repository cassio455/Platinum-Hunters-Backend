import { GuideModel } from "../../data/documents/guideDocument.js";

// Função para listar todos os guides
export const listGuideService = async () => {
  const guides = await GuideModel.find();
  return guides;
};