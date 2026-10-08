/*
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * Copyright (C) 2026 Executive Gibraltaz
 */

import express from 'express';

const port = process.env.PORT || 9000;

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
    res.json({
        name: 'Maestrozo Backend'
    });
});

app.listen(port, () => {
    console.log(`Maestrozo Backend is listening on port ${port}`);
});
