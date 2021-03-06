/*
 * Copyright (c) 2019, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

export default {
    oidc: {
      clientId: '0oa9vw4l7MoobHoFc5d6',
      redirectUri: 'com.okta.dev-7931343:/callback',
      endSessionRedirectUri: 'com.okta.dev-7931343:/logoutCallback',
      discoveryUri: 'https://dev-7931343.okta.com/oauth2/default',
      scopes: ['openid', 'profile', 'offline_access'],
      requireHardwareBackedKeyStore: false,
    }
  };
  
  // clientId: '{clientId}',
  // redirectUri: '{customUriScheme}:/loginCallback',
  // endSessionRedirectUri: '{customUriScheme}:/logoutCallback',
  // discoveryUri: 'https://{yourOktaDomain}/oauth2/default',
  // scopes: ["openid", "profile", "offline_access"],
  // requireHardwareBackedKeyStore: false,