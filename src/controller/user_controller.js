import {db} from "./firebase_controller";
import {logDOM} from "@testing-library/react";

class UserController {
    userCollection = db.collection('users');
    signDocCollection = db.collection('sign-docs');

    async addNewDocToFirebase(emailList, document) {
        const users = await this.getUIDsFromEmails(emailList);
        console.log(users)
        const docRef = db.collection("sign-docs").doc();

        const uids = users.map(u => ({uid: u.uid}))
        const body = {
            multilateralId: document.multilateralId,
            fileName: document.fileName,
            firmados: [],
            numeroFirmas: users.length,
            docType: document.docType,
            usuarios: users,
            uids,
        }
        console.log(body)
        docRef.set(body)
            .then(docRef => console.log(docRef))
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
            await this.userCollection.where('email', '==', email)
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

    getUserDocs(uid) {
        const docs = []
        db.collection("sign-docs").where('uids', 'array-contains', {uid: uid})
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    const docData = doc.data()
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