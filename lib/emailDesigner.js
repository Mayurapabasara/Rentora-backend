export default function getDesignedEmail({title, subtitle, heading, message, otp, footerText = "Premium Shopping Experience", company = "Rentora", logo = "https://yourdomain.com/logo.png", primaryColor = "#ff7a00", secondaryColor = "#ff9d2f"}) {

    return `

    <div style="
        width:100%;
        background:#f5f5f5;
        padding:40px 0;
        font-family:Arial,sans-serif;
    ">

        <div style="
            max-width:600px;
            margin:auto;
            background:white;
            border-radius:20px;
            overflow:hidden;
            box-shadow:0 10px 30px rgba(0,0,0,0.1);
        ">

            <!-- Header -->
            <div style="
                background:linear-gradient(135deg,${primaryColor},${secondaryColor});
                padding:40px;
                text-align:center;
            ">

                <img 
                    src="${logo}" 
                    alt="${company} Logo"
                    style="width:140px;margin-bottom:15px;"
                />

                <h1 style="
                    color:white;
                    margin:0;
                    font-size:32px;
                    font-weight:700;
                ">
                    ${title}
                </h1>

                <p style="
                    color:#ffe7cc;
                    margin-top:10px;
                    font-size:16px;
                ">
                    ${subtitle}
                </p>

            </div>

            <!-- Content -->
            <div style="padding:45px;">

                <h2 style="
                    color:#222;
                    margin-top:0;
                    font-size:24px;
                ">
                    ${heading}
                </h2>

                <p style="
                    color:#555;
                    font-size:16px;
                    line-height:1.8;
                ">
                    ${message}
                </p>

                <!-- OTP BOX -->
                <div style="
                    margin:35px 0;
                    text-align:center;
                ">

                    <div style="
                        display:inline-block;
                        background:#fff5eb;
                        border:2px dashed;
                        padding:20px 40px;
                        border-radius:16px;
                    ">

                        <span style="
                            font-size:40px;
                            font-weight:700;
                            letter-spacing:10px;
                            color:${primaryColor};
                        ">
                            ${otp}
                        </span>

                    </div>

                </div>

                <p style="
                    color:#666;
                    font-size:15px;
                    text-align:center;
                ">
                    This OTP is valid for 
                    <strong>10 minutes</strong>.
                </p>

                <div style="
                    margin-top:35px;
                    padding:20px;
                    background:#fff8f1;
                    border-left:4px solid;
                    border-radius:10px;
                ">

                    <p style="
                        margin:0;
                        color:#666;
                        font-size:14px;
                        line-height:1.7;
                    ">
                        If you did not request this action, you can safely ignore this email.
                    </p>

                </div>

            </div>

            <!-- Footer -->
            <div style="
                background:#111;
                padding:30px;
                text-align:center;
            ">

                <h3 style="
                    color:white;
                    margin:0;
                    font-size:22px;
                ">
                    ${company}
                </h3>

                <p style="
                    color:#999;
                    margin-top:10px;
                    font-size:14px;
                ">
                    ${footerText}
                </p>

                <p style="
                    color:#666;
                    margin-top:20px;
                    font-size:13px;
                ">
                    © 2026 ${company}. All rights reserved.
                </p>

            </div>

        </div>

    </div>

    `;
}