class User {
	constructor(id, token, screenName, email, nix, avatar) {
		this._id = id;
		this.token = token;
		this.screenName = screenName;
		this.email = email;
		this.nix = nix;
		this.avatar = avatar;
	}
}

export default User;
