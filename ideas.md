# ideas for the workshop

## steps

TODO define upload bucket as env variable

steps to make the project work :
    - Make basic python sam app that depends on params and s3
    - step 1 : cfn lint
    - step 2 : cfn nag
    - step 3 : taskcat && upload to s3
    - pipieline should fail if any of the above fail
    - step 4 : deploy sam for real
