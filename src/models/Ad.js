class Ad {
	constructor(
		title,
		description,
		category,
		virtualPrice,
		picture,
		creator,
		wanted,
		location
	) {
		this.title = title;
		this.description = description;
		this.category = category;
		this.virtualPrice = virtualPrice;
		this.picture = picture;
		this.creator = creator;
		this.wanted = wanted;
		this.location = location;
	}
}

export default Ad;
