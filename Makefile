clean:
	rm -rf daemon/build
	rm -rf dist/
daemon:
	cd daemon && ./gradlew bootJar
