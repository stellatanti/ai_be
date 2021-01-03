import * as express from 'express';


export function send_response(res: express.Response, data: any | string, content_type: 'image/png' | 'image/jpeg' | 'text/plain' | 'text/html' | 'text/csv' | 'application/json' | 'text/javascript' | 'application/msword' | 'application/vnd.google-earth.kml+xml .kml' | 'application/vnd.ms-excel' = 'application/json', no_cache: boolean = true) {

    // if (is_development_cfg(cfg)) {
    //     res.setHeader('Access-Control-Allow-Origin', '*');
    // }

    if (no_cache) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }

    res.setHeader('Content-Type', content_type);

    if (content_type === 'application/json') {
        if (typeof (data) === 'string') {
            res.write(data);
        } else {
            res.write(JSON.stringify(data));
        }
    } else if (content_type === 'text/csv') {
        res.setHeader('Content-Type', content_type + "; charset=utf-8");
        res.setHeader("Content-Disposition", 'attachment; filename="export.csv"');
        res.write(data);
    } else if (content_type === 'application/vnd.google-earth.kml+xml .kml') {
        res.setHeader('Content-Type', content_type + "; charset=utf-8");
        res.setHeader("Content-Disposition", 'attachment; filename="export.kml"');
        res.write(data);
    } else if (content_type === 'application/vnd.ms-excel') {
        res.setHeader('Content-Type', content_type + "; charset=utf-8");
        res.setHeader("Content-Disposition", 'attachment; filename="export.xlsx"');
        res.write(data);
    }
    else {
        res.write(data);
    }

    res.end();
}
