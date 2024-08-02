export async function getImages() {
  const baseUrl = 'http://damopen.docker.localhost:8000';

  const AUTH_HEADER = {
    username: 'admin',
    password: 'j25wpPsLg6',
  };
  const credentials = btoa(`${AUTH_HEADER.username}:${AUTH_HEADER.password}`);

  console.log(window.location, 'windowwwww');

  const searchParams = new URLSearchParams(window.location.search);
  console.log(searchParams, 'searchParams');

  const UPLOAD_ID = searchParams.get('upload_id');
  console.log('🚀 ~ getImages ~ UPLOAD_ID:', UPLOAD_ID);

  const response = await fetch(
    `${baseUrl}/jsonapi/file/image?filter[field_upload_id]=${UPLOAD_ID}`,
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }
  );

  const json = await response.json();
  return json;
  console.log('🚀 ~ getImages ~ response:', json);
}
