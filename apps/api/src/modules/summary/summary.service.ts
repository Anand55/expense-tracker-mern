import mongoose from 'mongoose';

export interface ByCategoryItem {
  categoryId: string;
  categoryName: string;
  total: number;
}

export interface SummaryResult {
  totalSpend: number;
  count: number;
  byCategory: ByCategoryItem[];
}

export async function getSummary(
  userId: string,
  month: string
): Promise<SummaryResult> {
  const [y, m] = month.split('-').map(Number);
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0, 23, 59, 59, 999);

  const match = {
    userId: new mongoose.Types.ObjectId(userId),
    date: { $gte: start, $lte: end },
  };

  const db = mongoose.connection.db;
  if (!db) throw new Error('Database not connected');

  const [aggregated, totals] = await Promise.all([
    db
      .collection('expenses')
      .aggregate<{ _id: mongoose.Types.ObjectId; total: number }>([
        { $match: match },
        {
          $group: {
            _id: '$categoryId',
            total: { $sum: '$amount' },
          },
        },
      ])
      .toArray(),
    db
      .collection('expenses')
      .aggregate<{ totalSpend: number; count: number }>([
        { $match: match },
        {
          $group: {
            _id: null,
            totalSpend: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0 } },
      ])
      .toArray(),
  ]);

  const categoryIds = aggregated.map((a) => a._id);
  const categories = await db
    .collection('categories')
    .find({ _id: { $in: categoryIds } })
    .project({ _id: 1, name: 1 })
    .toArray();

  const nameMap = new Map(
    categories.map((c) => [c._id.toString(), (c as { name: string }).name])
  );

  const byCategory = aggregated.map((a) => ({
    categoryId: a._id.toString(),
    categoryName: nameMap.get(a._id.toString()) ?? 'Unknown',
    total: a.total,
  }));

  const totalSpend = totals[0]?.totalSpend ?? 0;
  const count = totals[0]?.count ?? 0;

  return { totalSpend, count, byCategory };
}
