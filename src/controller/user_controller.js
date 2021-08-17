import {db} from "./firebase_controller";

class UserController {

    userCollection = db.collection('users');

    async addNewDocToFirebase(emailList, multilateralID) {
        const uids = await this.getUIDsFromEmails(emailList);
        const docRef = db.collection("sign-docs").doc();
        docRef.set({
            multilateralID,
            usuarios: uids
        }).then(async () => {
            console.log("Document successfully updated!");
            await this.addNewDocAlert(uids, multilateralID);
        })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });

    }

    getSignDocData(multilateralID) {

    }

    async getUIDsFromEmails(emailList) {
        const uids = []
        for (const email of emailList) {
            await this.userCollection.where('email', '==', email)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        uids.push(doc.data().uid)
                    });
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
        }
        return uids;
    }

    async addNewDocAlert(uids, multilateralID) {
        for (const uid of uids) {
            await db.collection("users").where('uid', '==', uid).get()
                .then(snapshot => {
                    snapshot.forEach(async doc => {
                        await doc.ref.collection('por-firmar')
                            .doc(multilateralID.toString())
                            .set({
                                multilateralID,
                            });
                    });
                })
                .catch(err => console.log('Error getting documents', err));
        }
    }
}


export default UserController