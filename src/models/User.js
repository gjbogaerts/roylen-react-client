class User {
	constructor(id, token, screenName, email, nix) {
		this._id = id;
		this.token = token;
		this.screenName = screenName;
		this.email = email;
		this.nix = nix;
	}
}

export default User;
