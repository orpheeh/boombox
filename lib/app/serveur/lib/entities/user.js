module.exports = class User {

    constructor(sid){
        this.sid = sid;
        this.createdAt = new Date();
    }
}