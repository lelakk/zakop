<# : batch portion
@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------

@echo off
setlocal

set ERROR_CODE=0

@REM To isolate internal variables from possible post scripts, we use another setlocal
@setlocal

@REM ==== START VALIDATION ====
if not "%JAVA_HOME%"=="" goto OkJHome
for %%i in (java.exe) do set "JAVACMD=%%~$PATH:i"
goto checkJCmd

:OkJHome
set "JAVACMD=%JAVA_HOME%\bin\java.exe"

:checkJCmd
if exist "%JAVACMD%" goto chkMHome

echo The JAVA_HOME environment variable is not defined correctly, >&2
echo this environment variable is needed to run this program. >&2
goto error

:chkMHome
set "MAVEN_PROJECTBASEDIR=%~dp0"
if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set "MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%"

set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain"

powershell -Command "& {&'%~f0' %*}"
exit /b %ERROR_CODE%

:error
exit /b 1

: end batch / begin powershell #>

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$WrapperJar = Join-Path $ScriptDir ".mvn/wrapper/maven-wrapper.jar"
$WrapperProperties = Join-Path $ScriptDir ".mvn/wrapper/maven-wrapper.properties"

if (-not (Test-Path $WrapperJar)) {
    Write-Host "Downloading Maven Wrapper..."
    $prop = ConvertFrom-StringData (Get-Content $WrapperProperties -Raw)
    $url = $prop.wrapperUrl
    if (-not $url) {
        $url = "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar"
    }
    Invoke-WebRequest -Uri $url -OutFile $WrapperJar
}

$javaCmd = "java"
if ($env:JAVA_HOME) {
    $javaCmd = Join-Path $env:JAVA_HOME "bin/java.exe"
}

& $javaCmd "-Dmaven.multiModuleProjectDirectory=$ScriptDir" -jar $WrapperJar $args
exit $LASTEXITCODE
