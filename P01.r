## ------------------------------------------------------------------------------------------------
library("tidyverse")
library("ggplot2")


## ------------------------------------------------------------------------------------------------
weather <- read.csv(file="https://raw.githubusercontent.com/kippyan/DataScience/master/dehliweather.csv",)


## ------------------------------------------------------------------------------------------------
colnames(weather)[colnames(weather)=="datetime_utc"]<-"datetime_utc"
colnames(weather)[colnames(weather)=="X_conds"]<-"air_condition"
colnames(weather)[colnames(weather)=="X_dewptm"]<-"dew_point"
colnames(weather)[colnames(weather)=="X_fog"]<-"any_fog"
colnames(weather)[colnames(weather)=="X_hail"]<-"any_hail"
colnames(weather)[colnames(weather)=="X_heatindexm"]<-"heat_index"
colnames(weather)[colnames(weather)=="X_hum"]<-"humidity"
colnames(weather)[colnames(weather)=="X_precipm"]<-"precipitation"
colnames(weather)[colnames(weather)=="X_pressurem"]<-"air_pressure"
colnames(weather)[colnames(weather)=="X_rain"]<-"any_rain"
colnames(weather)[colnames(weather)=="X_snow"]<-"any_snow"
colnames(weather)[colnames(weather)=="X_tempm"]<-"temperature"
colnames(weather)[colnames(weather)=="X_thunder"]<-"any_thunder"
colnames(weather)[colnames(weather)=="X_tornado"]<-"any_tornadoes"
colnames(weather)[colnames(weather)=="X_vism"]<-"visibility"
colnames(weather)[colnames(weather)=="X_wdird"]<-"wind_angle"
colnames(weather)[colnames(weather)=="X_wdire"]<-"wind_direction"
colnames(weather)[colnames(weather)=="X_wgustm"]<-"wind_gust_speed"
colnames(weather)[colnames(weather)=="X_windchillm"]<-"wind_chill"
colnames(weather)[colnames(weather)=="X_wspdm"]<-"wind_average_speed"
head(weather, n =5)


## ------------------------------------------------------------------------------------------------
weather <- subset(weather, select = -c(any_snow, any_hail, any_tornadoes, precipitation))
weather <- subset(weather, !is.na(weather$heat_index))
#weather <- subset(weather, !is.na(weather$wind_chill))
#weather <- subset(weather, !is.na(weather$wind_gust_speed))

weather <- subset(weather, !(weather$air_pressure == -9999))
weather$datetime_utc[1]


## ------------------------------------------------------------------------------------------------
weather$time = weather$datetime_utc
weather <- weather[,c(1,17,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16)]
weather$time <- strsplit(as.character(weather$time),"-")
weather$time <- sapply(weather$time, function(time){ return(time[2]) })
weather$time <- parse_time(as.character(weather$time), format = "%H:%M")
head(weather$time)


## ------------------------------------------------------------------------------------------------
weather$date = weather$datetime_utc
weather <- weather[,c(1,2,18,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17)]
weather$date <- strsplit(as.character(weather$datetime_utc),"-")
weather$date <- sapply(weather$date, function(date){ return(date[1]) })
weather$date <- parse_date(as.character(weather$date), format = "%Y%m%d")
head(weather$date)


## ------------------------------------------------------------------------------------------------
weather$datetime_utc <- as.POSIXct(parse_datetime(as.character(weather$datetime_utc), format = "%Y%m%d-%H:%M"))
head(weather$datetime_utc)


## ------------------------------------------------------------------------------------------------
dailyweather <- weather %>% arrange(date, time) %>% group_by(date) %>% slice(1)


