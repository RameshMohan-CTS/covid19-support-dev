import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';


const nodemailer = require('nodemailer');

admin.initializeApp();

const superadmins = [`superadmin@${functions.config().appsettings.authdomain}`];

const doesAuthTokenExist = (context: any) => context && context.auth && context.auth.token;
const isSuperAdmin = (email: string) => superadmins.indexOf(email.toLowerCase()) > -1;
const isAdmin = (context: any) => doesAuthTokenExist(context) && context.auth?.token.admin === true;
const isModerator = (context: any) => doesAuthTokenExist(context) && context.auth?.token.moderator === true;
const isVerifiedVolunteer = (context: any) => doesAuthTokenExist(context) && context.auth?.token.verifiedvolunteer === true;
const canAssignAdminRole = (data: any, context: any) => isSuperAdmin(data.email) || (doesAuthTokenExist(context) && (isAdmin(context) || isSuperAdmin(data.email)));
const canAssignModeratorRole = (data: any, context: any) => canAssignAdminRole(data, context) || isModerator(context);
const canVerifyVolunteerRole = (data: any, context: any) => canAssignModeratorRole(data, context) || isVerifiedVolunteer(context);
const maskText = (text: string) => text.split("").map((v: string, i: number) => (i < 4 || i > 8) ? v : '*').join('');

export const markUserAsAdmin = (email: string) => {
    return new Promise((resolve, reject) => {
        let newProfile: any = {};
        newProfile.isadmin = true;
        var userRef = admin.firestore().collection('user_profiles').doc(email.toLowerCase());
        userRef.set(newProfile, { merge: true }).then((res) => {
            console.log("Data from user profiles");
            resolve();
        }).catch((ex) => {
            console.log("Unable to read Data from user profiles");
            console.log(ex);
            reject();
        })
    })
};

export const markUserAsModerator = (email: string) => {
    return new Promise((resolve, reject) => {
        let newProfile: any = {};
        newProfile.ismoderator = true;
        var userRef = admin.firestore().collection('user_profiles').doc(email.toLowerCase());
        userRef.set(newProfile, { merge: true }).then((res) => {
            resolve();
        }).catch((ex) => {
            reject();
        })
    })
};

export const markUserAsVerifiedVolunteer = (email: string) => {
    return new Promise((resolve, reject) => {
        let newProfile: any = {};
        newProfile.isverifiedvolunteer = true;
        var userRef = admin.firestore().collection('user_profiles').doc(email.toLowerCase());
        userRef.set(newProfile, { merge: true }).then((res) => {
            resolve();
        }).catch((ex) => {
            reject();
        })
    })
};

export const updateUserProfile = functions.https.onCall((data, context) => {
    return new Promise((resolve, reject) => {
        let newProfile: any = {};
        newProfile.firstname = data && data.firstname ? data.firstname : "";
        newProfile.lastname = data && data.lastname ? data.lastname : "";
        newProfile.fullname = data && data.fullname ? data.fullname : "";
        newProfile.username = data && data.username ? data.username : "";
        newProfile.uid = context.auth?.uid;
        newProfile.last_login_time = new Date();
        var userRef = admin.firestore().collection('user_profiles').doc(data.username.toLowerCase());
        userRef.set(newProfile, { merge: true }).then((res) => {
            resolve(res);
        }).catch((ex) => {
            reject(ex);
        })
    })
});

export const updateUserProfileAll = functions.https.onCall((data, context) => {
    return new Promise((resolve, reject) => {
        // need to verify user
        let newProfile: any = {};
        newProfile.firstname = data && data.firstname ? data.firstname : "";
        newProfile.lastname = data && data.lastname ? data.lastname : "";
        newProfile.fullname = data && data.fullname ? data.fullname : "";
        newProfile.username = data && data.username ? data.username : "";
        newProfile.isavailablevolunteer = data.isavailablevolunteer;
        newProfile.uid = context.auth?.uid;
        newProfile.isadult = data.isadult;
        newProfile.isregisteredvolunteer = true;
        newProfile.last_login_time = new Date();
        var userRef = admin.firestore().collection('user_profiles').doc(data.username.toLowerCase());
        userRef.set(newProfile, { merge: true }).then((res) => {
            resolve(res);
        }).catch((ex) => {
            reject(ex);
        })
    })
});

export const registerUserAsVolunteer = functions.https.onCall((data, context) => {
    return new Promise((resolve, reject) => {
        // validate user
        let newProfile: any = {};
        newProfile.isregisteredvolunteer = true;
        newProfile.isavailablevolunteer = data.isavailablevolunteer;
        newProfile.last_login_time = new Date();
        var userRef = admin.firestore().collection('user_profiles').doc(data.username.toLowerCase());
        userRef.set(newProfile, { merge: true }).then((res) => {
            resolve({
                msg: "User Registered as volunteer"
            });
        }).catch((ex) => {
            reject(ex);
        })
    })
});

export const assignRole = functions.https.onCall((data, context) => {
    console.log("Assigning Role");
    console.log(data);
    if (data && data.email && data.typeofrole) {
        if (data.typeofrole === `admin`) {
            console.log("admin");
            return admin.auth().getUserByEmail(data.email).then(user => {
                console.log(user);
                if (canAssignAdminRole(data, context)) {
                    console.log("Yes i can assign role");
                    let adminClaims = {
                        admin: true,
                        moderator: user && user.customClaims && user.customClaims.moderator,
                        verifiedvolunteer: user && user.customClaims && user.customClaims.verifiedvolunteer,
                    };
                    return admin.auth().setCustomUserClaims(user.uid, adminClaims).then(async (ref) => {
                        console.log("Set the claims");
                        await markUserAsAdmin(data.email);
                        return ref;
                    });
                } else {
                    console.log("Only admins can cascade admin rights");
                    throw new Error("Only admins can cascade admin rights");
                }
            }).then(() => {

                console.log("Added user as admin");
                return {
                    data: `Added user ${data.email} as admin`
                }
            }).catch((err) => {
                return err;
            })
        } else if (data.typeofrole === `moderator`) {
            return admin.auth().getUserByEmail(data.email).then(user => {
                if (canAssignModeratorRole(data, context)) {
                    let moderatorClaims = {
                        admin: user && user.customClaims && user.customClaims.admin,
                        moderator: true,
                        verifiedvolunteer: user && user.customClaims && user.customClaims.verifiedvolunteer,
                    };
                    return admin.auth().setCustomUserClaims(user.uid, moderatorClaims).then(async (ref) => {
                        await markUserAsModerator(data.email);
                        return ref;
                    });
                } else {
                    throw new Error("Only admins / moderator can cascade moderator rights");
                }
            }).then(() => {
                return {
                    data: `Added user ${data.email} as moderator`
                }
            }).catch((err) => {
                return err;
            })
        } else if (data.typeofrole === `verifiedvolunteer`) {
            return admin.auth().getUserByEmail(data.email).then(user => {
                if (canVerifyVolunteerRole(data, context)) {
                    let volunteerClaims = {
                        admin: user && user.customClaims && user.customClaims.admin,
                        moderator: user && user.customClaims && user.customClaims.moderator,
                        verifiedvolunteer: true,
                    };
                    return admin.auth().setCustomUserClaims(user.uid, volunteerClaims).then(async (ref) => {
                        await markUserAsVerifiedVolunteer(data.email);
                        return ref;
                    });
                } else {
                    throw new Error("Only admins / moderator / verified volunteers can verify other volunteers");
                }
            }).then(() => {
                return {
                    data: `Volunteer ${data.email} marked as verified`
                }
            }).catch((err) => {
                return err;
            })
        } else {
            console.log("not a valid role");
            return {
                data: `Not a valid role`
            }
        }
    } else {
        return {
            data: `Not a valid email address`
        }
    }
});

export const sendSupportRequestNotification = functions.firestore.document('support_requests/{support_request}')
    .onCreate((snap, ctx) => {
        const support_request_id: string = snap.id;
        const data: any = snap.data();
        let authData = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: functions.config().admin_email.username,
                pass: functions.config().admin_email.password
            }
        });
        authData.sendMail({
            from: 'moderator@covid19-support-dev.web.app',
            to: `${data.contact.email}`,
            subject: `Support Request : ${data.request.title}. Req ID : ${support_request_id} `,
            text: `Your support request created successfully. Request id : ${support_request_id} Title: ${data.request.title}`,
            html: `<div>
                Your support request created successfully.<br/> 
                Title: <b>${data.request.title}</b><br/>
                Request id : ${support_request_id} <br/>
                Email address : ${maskText(data.contact.email)}<br/>
                Phone Number : ${maskText(data.contact.phone)}<br/>
             </div>`,
        })
            .then((res: any) => {
                console.log('successfully sent that mail');
            })
            .catch((err: any) => {
                console.log(err)
            });
    });

export const sendDonationDetailsToDonor = functions.firestore.document('donations/{donation}')
    .onCreate((snap, ctx) => {
        const donationid: string = snap.id;
        const data: any = snap.data();
        if (data.contact.email && data.contact.email !== "") {
            let authData = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: functions.config().admin_email.username,
                    pass: functions.config().admin_email.password
                }
            });
            authData.sendMail({
                from: 'moderator@covid19-support-dev.web.app',
                to: `${data.contact.email}`,
                subject: 'Donor Promise Details',
                text: `Your promise is submitted successfully. Reference No. : ${donationid} Title: ${data.donation.title}`,
                html: `<div>Your promise is submitted successfully.<br/> Reference No. : ${donationid} <br/>Title: <b>${data.donation.title}</b></div>`,
            })
                .then((res: any) => {
                    console.log('successfully sent email');
                })
                .catch((err: any) => {
                    console.log(err)
                });
        }
    });

export const sendDonationDetailsToVolunteer = functions.https.onCall((data, context) => {
    if (data && data.volunteerEmail) {
        let authData = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: functions.config().admin_email.username,
                pass: functions.config().admin_email.password
            }
        });
        authData.sendMail({
            from: 'moderator@covid19-support-dev.web.app',
            to: `${data.volunteerEmail}`,
            subject: 'Donor Promise Assigned',
            text: `Donor Promise is assigned to you with Title: ${data.donorPromiseTitle} 
            and Message: ${data.donorPromiseMsg}.  Donor Contact details are Name: ${data.donorName}, 
            Address: ${data.donorAddress}, Phone: ${data.donorPhone}, email: ${data.donorEmail}`,

            html: `<div>Donor Promise is assigned to you.<br/> 
            Title: <b>${data.donorPromiseTitle}</b><br/>
            Message: ${data.donorPromiseMsg} <br/><br/>
            <b>Donor Contact details</b>
            Name: ${data.donorName}<br/>
            Address: ${data.donorAddress}<br/> 
            Phone: ${data.donorPhone}<br/> 
            email: ${data.donorEmail}
            </div>`,
        })
            .then((res: any) => {
                console.log('email sent successfully');
                return {
                    data: `email sent successfully`
                }
            })
            .catch((err: any) => {
                console.log(err)
                return {
                    data: `error sending email: ${err}`
                }
            });
    }
});

export const sendNotificationOnVolunteerRegistration = functions.firestore.document('can_support/{volunteer}')
    .onCreate((snap, ctx) => {
        const volunteerEmail: string = snap.id;
        const data: any = snap.data();
        if (volunteerEmail && volunteerEmail !== "") {
            let authData = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: functions.config().admin_email.username,
                    pass: functions.config().admin_email.password
                }
            });

            //var emailSettings;

            fetchEmailSettings('volunteer_registration')
                .then((ref) => {

                    var emailSubject: string = "";
                    var txtMessage: string = "";
                    var htmlMessage: string = "";

                    emailSubject = ref.get("subject") || "";
                    console.log('Subject: ', emailSubject);
                    txtMessage = ref.get("textMessage") || "";
                    htmlMessage = ref.get("htmlMessage") || "";

                    txtMessage = txtMessage.replace("$$VOLUNTEERNAME$$", data.user_displayName);
                    htmlMessage = htmlMessage.replace("$$VOLUNTEERNAME$$", data.user_displayName);

                    authData.sendMail({
                        from: 'moderator@covid19-support-dev.web.app',
                        to: `${volunteerEmail}`,
                        subject: emailSubject,
                        text: txtMessage,
                        html: htmlMessage,
                    })
                        .then((res: any) => {
                            console.log('successfully sent email');
                        })
                        .catch((err: any) => {
                            console.log(err)
                        });
                })

            // async () => {
            //     var ref = await fetchEmailSettings('volunteer_registration');
            //     emailSubject = ref.get("subject") || "";
            //     console.log('Subject: ', emailSubject);
            //     txtMessage = ref.get("textMessage") || "";
            //     htmlMessage = ref.get("htmlMessage") || "";
            // }

            //var emailSettings = fetchEmailSettings('volunteer_registration');

            // var emailSubject: string = emailSettings?.get("subject")  || "";
            // var txtMessage: string = emailSettings?.get("textMessage")  || "";
            // var htmlMessage: string = emailSettings?.get("htmlMessage")  || "";        
        }
    });

export const sendEmailOnSupportRequestAssigned = functions.https.onCall((data, context) => {

    if (data && data.volunteerEmail) {

        let authData = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: functions.config().admin_email.username,
                pass: functions.config().admin_email.password
            }
        });
        authData.sendMail({
            from: 'moderator@covid19-support-dev.web.app',
            to: `${data.beneficiaryEmail}`,
            cc: `${data.volunteerEmail}`,
            subject: 'Support Request Assigned',

            text: `Hi ${data.beneficiaryName}, your request with below Id and title has been assigned 
            to a volunteer marked in this email, who will contact you to do the needful.
            Request Id: ${data.requestId}, Request Title: ${data.requestTitle}, 
            Volunteer Email: ${data.volunteerEmail}`,

            html: `<div>Hi ${data.beneficiaryName},<br/> 
            your request with below Id and title has been assigned 
            to a volunteer, who will contact you to do the needful.<br/><br/>             
            Request Id: ${data.requestId}<br/>
            Request Title: ${data.requestTitle}<br/>             
            Volunteer Email: ${data.volunteerEmail}
            </div>`,
        })
            .then((res: any) => {
                console.log('email sent successfully');
                return {
                    data: `email sent successfully`
                }
            })
            .catch((err: any) => {
                console.log(err)
                return {
                    data: `error sending email: ${err}`
                }
            });
    }
});

export const sendEmailNotification = functions.https.onCall((data, context) => {

    if (data && data.recipients) {

        let authData = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: functions.config().admin_email.username,
                pass: functions.config().admin_email.password
            }
        });
        authData.sendMail({
            from: `moderator@covid19-support-dev.web.app`,
            to: `${data.recipients}`,
            cc: `${data.copiedRecipients}`,
            subject: `${data.subject}`,

            text: `${data.mailContentPlainText}`,

            html: `${data.mailContentHtml}`,
        })
            .then((res: any) => {
                console.log('email sent successfully');
                return {
                    data: `email sent successfully`
                }
            })
            .catch((err: any) => {
                console.log(err)
                return {
                    data: `error sending email: ${err}`
                }
            });
    }
});

const fetchEmailSettings = (docId: string) => {

    return new Promise<Map<string, string>>((resolve, reject) => {

        var emailSettings = new Map();

        admin.firestore()
            .collection("email_settings")
            .doc(docId)
            .get()
            .then(docRef => {
                emailSettings.set("subject", docRef?.data()?.subject);
                console.log("subject => ", docRef?.data()?.subject);
                emailSettings.set("textMessage", docRef?.data()?.text_message);
                emailSettings.set("htmlMessage", docRef?.data()?.html_message);
                resolve(emailSettings);
            })
            .catch((err) => {
                console.log('error fetching email settings: ', err);
                reject();
            })

        //return emailSettings;
    })
};
