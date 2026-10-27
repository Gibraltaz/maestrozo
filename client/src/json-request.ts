/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

type JsonRequestOptions = {
  lang?: string
};

/*
const fetchJsonFromServer = async (url: string) => {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  try  {
    const response = await fetch(url, {
        method: 'GET',
        headers: headers,
    });
    if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

    // check text response does not container "<!DOCTYPE html>" :
    // if request does not exists, React (or Vite) does not respond witch a 404 error but with an HTML page)
    const textContent = await response.text();
    if (textContent.includes('<!DOCTYPE html>'))
        throw new Error(`Récupération du fichier «${url}» impossible`);

    // Convertir le texte en JSON
    return JSON.parse(textContent);
  }
  catch (error: any) {
    console.log(`Erreur récupération «${url}» :`, error.message);
    throw error;
  }
};
*/

const jsonFull = async (url: string, httpMethod:string, options?:JsonRequestOptions, parameters?:Record<string, string>) => {
  const lang = options?.lang ?? 'en';
  const fetchParam: RequestInit = {
    method : httpMethod,
    headers:  {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Accept-Language': lang
    },
  };
  if (parameters !== undefined) {
    const methodsWithBody = ['POST', 'PUT', 'PATCH'];
    if (methodsWithBody.includes(httpMethod)) {
      fetchParam.body = JSON.stringify(parameters);
    }
    else {
      const queryString = new URLSearchParams(parameters).toString();
      url += `?${queryString}`;
    }
  }
  const response = await fetch(url, fetchParam);
  if (! response.ok)
    throw new Error(`Erreur requête «${url}» : Status=${response.status} (${response.statusText})`);

  // Interpréter la réponse en fonction du type MIME de l'entête HTTP
  const contentType = response.headers.get("content-type") || '';
  if (! contentType.includes("application/json")) {
    const textResponse = await response.text();
    throw new Error(`Erreur requête «${url}» : réponse JSON attendue (${textResponse})`);
  }

  return await response.json();
}

const jsonGet = async (url:string , options?:JsonRequestOptions, parameters?:Record<string, string>) => {
    return await jsonFull(url, 'GET', options, parameters);
}

const jsonPost = async (url:string , parameters: Record<string, string>, options:JsonRequestOptions={}) => {
    return await jsonFull(url, 'POST', options, parameters);
}

export { jsonGet, jsonPost };

export type { JsonRequestOptions };
