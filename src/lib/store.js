export let userData = {
    firstName: "Juan",
    lastName: "Dela Cruz",
    education: "school schoolington",
    birthday: new Date(2011,2,12),
    sex: "Male",
    Address: "Address Name",
    Barangay: "Barangay Name",
    disabilityCategory: "Sample Category",
    disabilityNature: "Sample Nature",
    findAge() {
        let today = new Date()
        return (today.getFullYear() - this.birthday.getFullYear()).toString()
    },
}