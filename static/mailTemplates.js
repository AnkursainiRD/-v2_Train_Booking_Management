const otp=123
const otpHtmlTemplate=`<!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>
                        </head>
                        <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
                            <table role="presentation"
                            style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
                            <tbody>
                                <tr>
                                <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                                <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                                    <tbody>
                                    <tr>
                                        <td style="padding: 40px 0px 0px;">
                                        <div style="text-align: left;">
                                            <div style="padding-bottom: 20px;"><img src="https://i.ibb.co/Qbnj4mz/logo.png" alt="Company" style="width: 56px;"></div>
                                        </div>
                                        <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                                            <div style="color: rgb(0, 0, 0); text-align: left;">
                                            <h1 style="margin: 1rem 0">Verification code</h1>                       <p style="padding-bottom: 16px">Please use the verification code below to sign in.</p>
                                            <p style="padding-bottom: 16px"><strong style="font-size: 130%">${otp? otp:'xxxx'}</strong></p>
                                            <p style="padding-bottom: 16px">If you didn’t request this, you can ignore this email.</p>
                                            <p style="padding-bottom: 16px">Thanks,<br>The IR team</p>
                                            </div>                 
                                            </div>

                                        </td>
                                    </tr>
                                    </tbody>
                                    </table>
                                </td>
                                </tr>
                            </tbody>
                            </table>
                        </body>
                        </html>`


const ticketHtmlTemplate=`<!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>

                        <style>
                                $red: #e84c3d;
                        $grey: #ecedef;
                        $black: #343434;

                        .cardWrap {
                        width: 27em;
                        margin: 3em auto;
                        color: #fff;
                        font-family: sans-serif;
                        }

                        .card {
                        background: linear-gradient(
                            to bottom,
                            $red 0%,
                            $red 26%,
                            $grey 26%,
                            $grey 100%
                        );
                        height: 11em;
                        float: left;
                        position: relative;
                        padding: 1em;
                        margin-top: 100px;
                        }

                        .cardLeft {
                        border-top-left-radius: 8px;
                        border-bottom-left-radius: 8px;
                        width: 16em;
                        }

                        .cardRight {
                        width: 6.5em;
                        border-left: 0.18em dashed #fff;
                        border-top-right-radius: 8px;
                        border-bottom-right-radius: 8px;
                        &:before,
                        &:after {
                            content: "";
                            position: absolute;
                            display: block;
                            width: 0.9em;
                            height: 0.9em;
                            background: #fff;
                            border-radius: 50%;
                            left: -0.5em;
                        }
                        &:before {
                            top: -0.4em;
                        }
                        &:after {
                            bottom: -0.4em;
                        }
                        }

                        h1 {
                        font-size: 1.1em;
                        margin-top: 0;
                        span {
                            font-weight: normal;
                        }
                        }

                        .title,
                        .name,
                        .seat,
                        .time {
                        text-transform: uppercase;
                        font-weight: normal;
                        h2 {
                            font-size: 0.9em;
                            color: #525252;
                            margin: 0;
                        }
                        span {
                            font-size: 0.7em;
                            color: #a2aeae;
                        }
                        }

                        .title {
                        margin: 2em 0 0 0;
                        }

                        .name,
                        .seat {
                        margin: 0.7em 0 0 0;
                        }

                        .time {
                        margin: 0.7em 0 0 1em;
                        }

                        .seat,
                        .time {
                        float: left;
                        }

                        .eye {
                        position: relative;
                        width: 2em;
                        height: 1.5em;
                        background: #fff;
                        margin: 0 auto;
                        border-radius: 1em/0.6em;
                        z-index: 1;
                        &:before,
                        &:after {
                            content: "";
                            display: block;
                            position: absolute;
                            border-radius: 50%;
                        }
                        &:before {
                            width: 1em;
                            height: 1em;
                            background: $red;
                            z-index: 2;
                            left: 8px;
                            top: 4px;
                        }
                        &:after {
                            width: 0.5em;
                            height: 0.5em;
                            background: #fff;
                            z-index: 3;
                            left: 12px;
                            top: 8px;
                        }
                        }

                        .number {
                        text-align: center;
                        text-transform: uppercase;
                        h3 {
                            color: $red;
                            margin: 0.9em 0 0 0;
                            font-size: 2.5em;
                        }
                        span {
                            display: block;
                            color: #a2aeae;
                        }
                        }

                        .barcode {
                        height: 2em;
                        width: 0;
                        margin: 1.2em 0 0 0.8em;
                        box-shadow: 1px 0 0 1px $black, 5px 0 0 1px $black, 10px 0 0 1px $black,
                            11px 0 0 1px $black, 15px 0 0 1px $black, 18px 0 0 1px $black,
                            22px 0 0 1px $black, 23px 0 0 1px $black, 26px 0 0 1px $black,
                            30px 0 0 1px $black, 35px 0 0 1px $black, 37px 0 0 1px $black,
                            41px 0 0 1px $black, 44px 0 0 1px $black, 47px 0 0 1px $black,
                            51px 0 0 1px $black, 56px 0 0 1px $black, 59px 0 0 1px $black,
                            64px 0 0 1px $black, 68px 0 0 1px $black, 72px 0 0 1px $black,
                            74px 0 0 1px $black, 77px 0 0 1px $black, 81px 0 0 1px $black;
                        }

                        </style>
                        </head>
                        <body>
                            <div class="cardWrap">
                        <div class="card cardLeft">
                            <h1>Indian <span>Railways</span></h1>
                            <div class="title">
                            <h2>Delhi To Dehradhun</h2>
                            <span>Train</span>
                            </div>
                            <div class="name">
                            <h2>Eren Jeager</h2>
                            <span>name</span>
                            </div>
                            <div class="seat">
                            <h2>156</h2>
                            <span>seat</span>
                            </div>
                            <div class="time">
                            <h2>12:00</h2>
                            <span>time</span>
                            </div>

                        </div>
                        <div class="card cardRight">
                            <div class="eye"></div>
                            <div class="number">
                            <h3>156</h3>
                            <span>seat</span>
                            </div>
                            <div class="barcode"></div>
                        </div>

                        </div>
                        </body>
                        </html>
                        `


export {otpHtmlTemplate,ticketHtmlTemplate}
