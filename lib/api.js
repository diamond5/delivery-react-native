import * as Storage from './localstorage'

class Api {
  static headers() {
        return {
          'Content-Type': 'application/json',
          'secretKey': 'oE8TaKw2yF67tNm4kYf2dG6FUKjho3uB'
        }
  }

  static get(route) {
    return this.xhr(route, null, 'GET');
  }

  static put(route, params) {
    return this.xhr(route, params, 'PUT')
  }

  static post(route, params) {
    return this.xhr(route, params, 'POST')
  }

  static delete(route, params) {
    return this.xhr(route, params, 'DELETE')
  }

  static xhr(route, params, verb) {

    //Storage.get('token').then((token) => {
    
        const host = 'http://94.23.55.212/smudgeapi/api/deliverymaster/'
        const url = `${host}${route}`
        let options = Object.assign({ method: verb }, params ? { body: JSON.stringify(params) } : null);
        
        if(route == "register" || route == "getgcmsenderid")
        {
              options.headers = Api.headers()
              return fetch(url, options).then(resp => {
                let json = resp.json();
                if (resp.ok) {
                  return json
                }

                return json.then(err => {
                  console.log('Error : ' + err.message);
                  throw err
                });
              });
        }
        else
        {
           return  Storage.get('token').then((token) => {
              if(token != null)
              {
                   let headers = Api.headers();
                   headers.organizationToken = token;
                   options.headers = headers;
                   //console.log("organizationToken :From Storage "+ token)
                    return fetch(url, options).then(resp => {
                      //console.log("brfore json pars "+ resp)
                      let json = resp.json();
                      //console.log("after json pars  "+ json)
                      if (resp.ok) {
                        return json
                      }
                    
                      return json.then(err => {
                        console.log('Error : ' + err.message);
                        throw err
                      });
                    });
              }
              else{
                console.log('Invalid token Error  ' + token);
                let err = { message: 'Invalid token' };
                throw err;
              }
            }).catch((err) => {
              console.log(err);
              if(typeof(err.message) != 'undefined' && err.message != null)
               { throw err;}
              else{
                  err['message'] = 'Invalid token';
                  throw err;
              }
            });
        }
    //});

  }
}

export default Api
