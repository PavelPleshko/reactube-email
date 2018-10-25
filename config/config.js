const config = {
	email:{
		clientEmail:process.env.CLIENT_EMAIL,
		clientPassword:process.env.CLIENT_PASS,
		serviceName:process.env.MAIL_SERVICE,
		servicePort:process.env.SERVICE_PORT,
		serviceHost:process.env.SERVICE_HOST
	},
	app:{
		host:process.env.HOST,
		port:process.env.PORT
	},
	database:{
		uri:process.env.DATABASE_URI
	}	
}

export default config;