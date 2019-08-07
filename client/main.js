/* jshint esversion: 6 */

window.onload = function() {

    // var template = '<li>{{peeyush.text}}</li>';
    // var myTask = Vue.component('my-task', {
    //     props: ['peeyush'],
    //     template: template
    // });

    let app = new Vue({
        el: '#app',
        data: {
            addEmployeeModal: false,
            editEmployeeModal: false,
            deleteEmployeeModal: false,
            // msg: 'Welcome to my first application, By Peeyush',
            // rawHtml: '<span style="color: red;">Text color should be RED!!</span>',
            usersList: [],
            currentUser: '',
            userData: {
                name: "",
                email: "",
                mobile: "",
                address: ""
            },
            userAddData: {
                name: "",
                email: "",
                mobile: "",
                address: ""
            }
        },
        mounted: function() {
            this.getAllUsersList();
        },
        // components: {
        //     myTask: myTask
        // },
        methods: {
            getAllUsersList: function() {
                axios.get('http://localhost:9000/allUsers').then(function(response) {
                    if (response.data.status === 1) {
                        app.usersList = response.data.data;
                    } else {
                        alert(response.data.message);
                    }
                });
            },
            getAUser: function(email) {
                if (email) {
                    axios.get('http://localhost:9000/allUsers/' + email).then(function(response) {
                        app.editEmployeeModal = true;
                        if (response.data.status === 1) {
                            app.userData = response.data.data;
                        } else {
                            alert(response.data.message);
                        }
                    });
                } else {
                    alert(" Incomplete Data! ");
                }
            },
            addNewUser: function(userData) {
                app.addEmployeeModal = false;
                if (userData && userData.name && userData.email && userData.address && userData.mobile) {
                    axios.post('http://localhost:9000/insertUser', {
                        email: userData.email,
                        name: userData.name,
                        mobile: userData.mobile,
                        address: userData.address
                    }).then(function(response) {
                        if (response.data.status === 1) {
                            app.getAllUsersList();
                        } else {
                            alert(response.data.message);
                        }
                    });
                } else {
                    alert(" Incomplete Data! ");
                }
            },
            selectUser: function(email) {
                app.currentUser = email;
            },
            deleteAUser: function() {
                if (app.currentUser) {
                    axios.delete('http://localhost:9000/deleteUser/' + app.currentUser).then(function(response) {
                        if (response.data.status === 1) {
                            app.getAllUsersList();
                        } else {
                            alert(response.data.message);
                        }
                    });
                } else {
                    alert(" Incomplete Data! ");
                }
            },
            deleteAllUsers: function(userData) {
                axios.delete('http://localhost:9000/deleteAllUser').then(function(response) {
                    if (response.data.status === 1) {
                        app.getAllUsersList();
                    } else {
                        alert(response.data.message);
                    }
                });
            },
            updateAUser: function(userData) {
                if (userData && userData.email) {
                    axios.patch('http://localhost:9000/updateUser', {
                        email: userData.email,
                        name: userData.name,
                        mobile: userData.mobile,
                        address: userData.address
                    }).then(function(response) {
                        app.editEmployeeModal = false;
                        if (response.data.status === 1) {
                            app.getAllUsersList();
                        } else {
                            alert(response.data.message);
                        }
                    });
                } else {
                    alert(" Incomplete Data! ");
                }
            },
            clickMe: function() {
                alert(" Click is working! ");
            }
        }
    });
};