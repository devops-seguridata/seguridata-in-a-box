class SIBUser {
    fullName;
    rfc;
    token;
    email;
    onboarding;

    constructor(data) {
        Object.assign(this, data);
    }
}
export default SIBUser