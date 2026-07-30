class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    if (this.queryString.search) {
      const keyword = this.queryString.search.trim();
      this.query = this.query.find({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { brand: { $regex: keyword, $options: 'i' } },
          { category: { $regex: keyword, $options: 'i' } },
          { material: { $regex: keyword, $options: 'i' } },
          { condition: { $regex: keyword, $options: 'i' } }
        ]
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['search', 'sort', 'page', 'limit', 'minPrice', 'maxPrice', 'availableOnly'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Category filter
    if (queryObj.category && queryObj.category !== 'All') {
      this.query = this.query.find({ category: queryObj.category });
    }

    // Condition filter
    if (queryObj.condition && queryObj.condition !== 'All') {
      this.query = this.query.find({ condition: queryObj.condition });
    }

    // Status filter (e.g. availableOnly)
    if (this.queryString.availableOnly === 'true') {
      this.query = this.query.find({ status: 'Available' });
    } else if (queryObj.status) {
      this.query = this.query.find({ status: queryObj.status });
    }

    // Price range bounds
    if (this.queryString.minPrice || this.queryString.maxPrice) {
      const priceFilter = {};
      if (this.queryString.minPrice) priceFilter.$gte = Number(this.queryString.minPrice);
      if (this.queryString.maxPrice) priceFilter.$lte = Number(this.queryString.maxPrice);
      this.query = this.query.find({ price: priceFilter });
    }

    return this;
  }

  sort() {
    // Primary status ordering: Available (1) before Sold (2), then selected sort parameter
    let sortOption = {};

    switch (this.queryString.sort) {
      case 'oldest':
        sortOption = { status: 1, createdAt: 1 };
        break;
      case 'priceAsc':
        sortOption = { status: 1, price: 1, createdAt: -1 };
        break;
      case 'priceDesc':
        sortOption = { status: 1, price: -1, createdAt: -1 };
        break;
      case 'newest':
      default:
        sortOption = { status: 1, createdAt: -1 };
        break;
    }

    this.query = this.query.sort(sortOption);
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 12;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
