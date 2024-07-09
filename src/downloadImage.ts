//const fs = require('fs');
//const http = require('http');
//const https = require('https');
import https from 'https';
import http from 'http';
import fs from 'fs';

import { Readable } from 'stream'
import { finished } from 'stream/promises'


interface Props {
	url: string;
	filename: string;

}

export const downloadImage = async ({ url, filename }: Props) => {



	let client: any = http;
	let options: string | https.RequestOptions = url

	const theUrl = new URL(url)

	if (url.toString().indexOf("https") === 0) {
		client = https;
		options = {
			host: theUrl.host,
			path: theUrl.pathname,
			port: 443,
			rejectUnauthorized: false

		}
	}

	return new Promise((resolve, reject) => {

		const file = fs.createWriteStream(filename);

		const request = client.get(options, (response: any) => {
			if (response.statusCode !== 200) {
				fs.unlink(filename, () => {
					if (response.statusCode !== 404) {

						console.error(`Failed (1) to get '${url}' (${response.statusCode})`);
					}
					resolve(false)
				});
				return;
			}



			response.pipe(file);
		});

		// The destination stream is ended by the time it's called
		file.on('finish', () => {

			resolve(true)
		});

		request.on('error', (err: any) => {
			fs.unlink(filename, () => {
				console.error(`Failed (2) to get '${url}' (${err.message})`);
				resolve(false)
			});
		});

		file.on('error', err => {
			fs.unlink(filename, () => {
				console.error(`Failed (3) to get '${url}' (${err.message})`);
				resolve(false)
			});
		});

		request.end();
	});

}