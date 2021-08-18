import {db} from "./firebase_controller";

class UserController {
    userCollection = db.collection('users');
    signDocCollection = db.collection('sign-docs');

    async addNewDocToFirebase(emailList, document) {
        const users = await this.getUIDsFromEmails(emailList);
        const docRef = db.collection("sign-docs").doc();
        docRef.set({
            multilateralId: document.multilateralId,
            fileName: document.fileName,
            firmados: [],
            numeroFirmas: users.length,
            usuarios: users
        }).then(async () => {
            console.log("Document successfully updated!");
            await this.addNewDocAlert(users, document.multilateralId);
        })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });

    }

    async getSignDocData(multilateralId) {
        const snapshot = await Promise.resolve(this.signDocCollection.where('multilateralId', '==', multilateralId).get())
        if (snapshot.size > 0) {
            return snapshot.docs[0].data();
        }
    }

    async getUIDsFromEmails(emailList) {
        const users = []
        for (const email of emailList) {
            this.userCollection.where('email', '==', email)
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        const docData = doc.data()
                        users.push({uid: docData.uid, email: docData.email, name: docData.fullname})
                    });
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
        }
        return users;
    }

    async addNewDocAlert(users, multilateralID) {
        for (const user of users) {
            await db.collection("users").where('uid', '==', user.uid).get()
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

    getUserDocs(email) {
        console.log('ptm')
        const docs =[]
        db.collectionGroup("sign-docs")
            .get()
                .then(snapshot => {
                    console.log(snapshot,'snap')
                    snapshot.forEach(doc => {
                        const docData = doc.data()
                        console.log(docData, 'doctada')
                        docs.push(docData)
                    });
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
        return docs;
    }
}


export default UserController