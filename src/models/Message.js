class Message {
	constructor(senderName, message, fromId, toId, adId, adTitle) {
		this.senderName = senderName;
		this.message = message;
		this.fromId = fromId;
		this.toId = toId;
		this.adId = adId;
		this.adTitle = adTitle;
	}
}

export default Message;
