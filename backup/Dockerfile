FROM postgres:16-alpine

RUN apk add --no-cache bash tzdata rclone
ENV TZ=Asia/Dhaka

RUN mkdir -p /backups /config
COPY backup.sh /backup.sh
RUN chmod +x /backup.sh

# Every 5 minutes
RUN echo "*/5 * * * * /backup.sh >> /var/log/cron.log 2>&1" > /etc/crontabs/root

CMD ["crond", "-f", "-l", "8"]