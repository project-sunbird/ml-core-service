/**
 * name : users.js
 * author : Aman Jung Karki
 * Date : 11-Nov-2019
 * Description : All users related api call.
 */

//dependencies
const request = require('request');
const userServiceUrl = process.env.USER_SERVICE_URL;

const profile = function ( token,userId = "" ) {
    return new Promise(async (resolve, reject) => {
        try {

            let url = userServiceUrl + constants.endpoints.USER_READ;

            if( userId !== "" ) {
                url = url + "/" + userId;
            }

            const options = {
                headers : {
                    "content-type": "application/json",
                    "x-authenticated-user-token" : token
                }
            };

            request.post(url,options,kendraCallback);

            function kendraCallback(err, data) {

                let result = {
                    success : true
                };

                if (err) {
                    result.success = false;
                } else {

                    let response = JSON.parse(data.body);
                    if( response.status === httpStatusCode['ok'].status ) {
                        result["data"] = response.result.response;
                    } else {
                        result["message"] = response.message;
                        result.success = false;
                    }

                }

                return resolve(result);
            }

        } catch (error) {
            return reject(error);
        }
    })
}

/**
  * 
  * @function
  * @name locationSearch
  * @param {object} filterData -  contain filter object.
  * @param {String} pageSize -  requested page size.
  * @param {String} pageNo -  requested page number.
  * @param {String} searchKey -  search string.
  * @param {Boolean} formatResult - format result
  * @param {Boolean} returnObject - return object or array.
  * @param {Boolean} resultForSearchEntities - format result for searchEntities api call.
  * @returns {Promise} returns a promise.
*/

const locationSearch = function ( filterData, pageSize = "", pageNo = "", searchKey = "" , formatResult = false, returnObject = false, resultForSearchEntities = false ) {
    return new Promise(async (resolve, reject) => {
        try {
        let bodyData = {};
        bodyData["request"] = {};
        bodyData["request"]["filters"] = filterData;

        if ( pageSize !== "" ) {
            bodyData["request"]["limit"] = pageSize;
        } 

        if ( pageNo !== "" ) {
            let offsetValue = pageSize * ( pageNo - 1 ); 
            bodyData["request"]["offset"] = offsetValue;
        }

        if ( searchKey !== "" ) {
            bodyData["request"]["query"] = searchKey
        }

          const url = 
          userServiceUrl + constants.endpoints.GET_LOCATION_DATA;
          const options = {
              headers : {
                "content-type": "application/json"
               },
              json : bodyData
          };
          request.post(url,options,requestCallback);
  
          let result = {
              success : true
          };
  
          function requestCallback(err, data) {
              if (err) {
                  result.success = false;
              } else {
                  let response = data.body;
                  
                  if( response.responseCode === constants.common.OK &&
                      response.result &&
                      response.result.response &&
                      response.result.response.length > 0
                    ) {
                      // format result if true
                        if ( formatResult ) {
                            let entityDocument = [];
                            response.result.response.map(entityData => {
                                let data = {};
                                data._id = entityData.id;
                                data.entityType = entityData.type;
                                data.metaInformation = {};
                                data.metaInformation.name = entityData.name;
                                data.metaInformation.externalId = entityData.code;
                                data.registryDetails = {};
                                data.registryDetails.locationId = entityData.id;
                                data.registryDetails.code = entityData.code;
                                entityDocument.push(data);
                            });
                            if ( returnObject ) {
                                result["data"] = entityDocument[0];
                                result["count"] = response.result.count;
                            } else {
                                result["data"] = entityDocument;
                                result["count"] = response.result.count;
                            }
                        } else if ( resultForSearchEntities ) {
                            let entityDocument = [];
                            response.result.response.map(entityData => {
                                let data = {};
                                data._id = entityData.id;
                                data.name = entityData.name;
                                data.externalId = entityData.code;
                                entityDocument.push(data);
                            });
                            result["data"] = entityDocument;
                            result["count"] = response.result.count;
                        }else {
                            result["data"] = response.result.response;
                            result["count"] = response.result.count;
                        }
                  } else {
                        result.success = false;
                  }
              }
              return resolve(result);
          }
  
          setTimeout(function () {
             return resolve (result = {
                 success : false
              });
          }, constants.common.SERVER_TIME_OUT);
  
  
        } catch (error) {
            return reject(error);
        }
    })
  }
  
  
  
  /**
    * 
    * @function
    * @name orgSchoolSearch
    *  @param {object} filterData -  contain filter object.
    * @param {String} pageSize -  requested page size.
    * @param {String} pageNo -  requested page number.
    * @param {String} searchKey -  search string.
    * @param {String} searchKey - search key for fuzzy search.
    * @param {String} fields -  required field filter.
    * @returns {Promise} returns a promise.
  */
  const orgSchoolSearch = function ( filterData, pageSize = "", pageNo = "", searchKey = "", fields = [] ) {
        return new Promise(async (resolve, reject) => {
            try {
                
                let bodyData = {};
                bodyData["request"] = {};
                bodyData["request"]["filters"] = filterData;
    
                if ( pageSize !== "" ) {
                    bodyData["request"]["limit"] = pageSize;
                } 
        
                if ( pageNo !== "" ) {
                    let offsetValue = pageSize * ( pageNo - 1 ); 
                    bodyData["request"]["offset"] = offsetValue;
                }
        
                if ( searchKey !== "" ) {
                    bodyData["request"]["fuzzy"] = {
                        "orgName" : searchKey
                    }
                }
                
                //for getting specified key data only.
                if ( fields.length > 0 ) {
                    bodyData["request"]["fields"] = fields;
                }
  
                const url = 
                userServiceUrl + constants.endpoints.GET_SCHOOL_DATA;
                const options = {
                    headers : {
                        "content-type": "application/json"
                        },
                    json : bodyData
                };
    
                request.post(url,options,requestCallback);
                let result = {
                    success : true
                };
    
                function requestCallback(err, data) {
        
                    if (err) {
                        result.success = false;
                    } else {
                        let response = data.body;
                        if( response.responseCode === constants.common.OK &&
                            response.result &&
                            response.result.response &&
                            response.result.response.content &&
                            response.result.response.content.length > 0
                        ){
                            result["data"] = response.result.response.content;
                            result["count"] = response.result.response.count;
                        } else {
                            result.success = false;
                        }
                    }
                    return resolve(result);
                }
                setTimeout(function () {
                    return resolve (result = {
                        success : false
                    });
                }, serverTimeout);
  
            } catch (error) {
                return reject(error);
            }
        })
    }

/**
  * get subEntities of matching type by recursion.
  * @method
  * @name getSubEntitiesBasedOnEntityType
  * @param parentIds {Array} - Array of entity Ids- for which we are finding sub entities of given entityType
  * @param entityType {string} - EntityType.
  * @returns {Array} - Sub entities matching the type .
*/

async function getSubEntitiesBasedOnEntityType( entityIds, entityType, result ) { 
    
    if( !entityIds.length > 0 ) {
      return result;
    };

    let bodyData = {
        "parentId" : entityIds
    };
    //get all immediate subEntities of type {entityType}
    let childEntities = await locationSearch(bodyData);

    if( ( !childEntities.success ) && !result.length > 0 ) {
      return result;
    }
    let parentEntities = [];
    if( childEntities.data[0].type == entityType ) {
        result = childEntities.data;
    } else {
        parentEntities = childEntities.map(function (entity) { return entity.id; });
    }
    
    if( parentEntities.length > 0 ){
      await getSubEntitiesBasedOnEntityType(parentEntities, entityType, result);
    } 
    return result;
}
  
module.exports = {
    profile : profile,
    locationSearch : locationSearch,
    orgSchoolSearch :orgSchoolSearch,
    getSubEntitiesBasedOnEntityType : getSubEntitiesBasedOnEntityType
}
