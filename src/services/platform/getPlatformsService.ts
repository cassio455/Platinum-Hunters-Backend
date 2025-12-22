import { PlatformModel } from '../../data/documents/platformDocument.js';

type GetPlatformsInput = {
  search?: string;
  page?: number;
  limit?: number;
};

export const getPlatformsService = async (input: GetPlatformsInput) => {
  const { search, page = 1, limit = 50 } = input;
  
  const filterQuery: any = {};
  
  if (search && search.trim()) {
    const searchLower = search.trim().toLowerCase();
    filterQuery.nameLower = { $regex: searchLower, $options: 'i' };
  }

  const skip = (page - 1) * limit;

  const items = await PlatformModel
    .find(filterQuery)
    .sort({ nameLower: 1 })
    .skip(skip)
    .limit(limit)
    .select('_id name')
    .lean();

  const total = await PlatformModel.countDocuments(filterQuery);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
