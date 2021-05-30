To deploy this code see the following instructions:

Zip the folder contaning all the code from the repository
```bash
$ zip -r {filename.zip} {foldername}
```
Example
```bash
$ zip -r send-feedback-lambda.zip send-feedback-lambda
```

Deploy your zip file contaning your code with the following command
```bash
aws lambda update-function-code --function-name {functionname} --zip-file fileb://{zipfilename}
```
