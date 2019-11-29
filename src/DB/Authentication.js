import DatabaseModule from './DatabaseModule';

var userAuthToken;

var getAuthToken = () => {
    return userAuthToken;
}

var userLogin = function(username, password, onFinishedCallback) {
    fetch('https://www.natureinstruct.org/api/authenticate?username=' + username + '&password=' + password)
        .then((response) => response.json())
        .then((responseJson) => {
            //Invalid user
            if (responseJson.errorCode) {
                onFinishedCallback(responseJson);
                return;
            }
            //Valid user -- Save token and save account to DB
            userAuthToken = responseJson.token;

            var res = responseJson;
            DatabaseModule.updateUser(res.userid, username, password, res.email, res.firstname, res.lastname, res.preferences.excludeNonBreeding,
                res.preferences.excludeRare, res.preferences.lang, res.preferences.naming, res.preferences.sorting,
                {success: onFinishedCallback});
        })
        .catch((error) => {
            console.error(error)
        });
}

var fetchNewToken = function(onFinishedCallback) {
    DatabaseModule.getCredentials((credentials) => {
        fetch('https://www.natureinstruct.org/api/authenticate?username=' + credentials.username + '&password=' + credentials.password)
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.errorCode) {
                    console.error(responseJson.errorMsg);
                    return;
                }
                userAuthToken = responseJson.token;
                onFinishedCallback();
            })
            .catch((error) => {
                console.error(error)
            });
    });
}

const Authentication = {
    getAuthToken: getAuthToken,
    userLogin: userLogin,
    fetchNewToken: fetchNewToken
};
export default Authentication;