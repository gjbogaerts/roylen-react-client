class Validation {
  constructor() {
    this.errors = [];
  }

  isEmail(email) {
    // eslint-disable-next-line no-useless-escape
    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi;
    if (!pattern.test(email)) {
      this.errors.push({
        id: 'email',
        msg: `${email} This is not a valid email address`
      });
    }
    return this;
  }

  isUnique(id, result) {
    if (result === false) {
      console.log(id, 'pushing error');
      this.errors.push({
        id,
        msg: `${id} is already in use; it needs to be unique`
      });
    } else {
      console.log(id, 'removing error');
      this.errors = this.errors.filter(err => err.id !== id);
    }
    console.log(this.errors);
    return this;
  }

  hasMinLength(val, id, minLength = 3) {
    if (val.length < minLength) {
      this.errors.push({
        id,
        msg: `${val} has less charachters than the required minimum of ${minLength}`
      });
    } else {
      this.errors = this.errors.filter(err => err.id !== id);
    }
    return this;
  }

  hasMaxLength(val, id, maxLength) {
    if (val.length > maxLength) {
      this.errors.push({
        id,
        msg: `${val} has more characters than the set maximum of ${maxLength}`
      });
    }
    return this;
  }

  isEqual(val1, val2) {
    if (val1 !== val2) {
      this.errors.push({
        id: 'equality',
        msg: `${val1} is not the samen as ${val2}`
      });
    }

    return this;
  }
}

export default Validation;
