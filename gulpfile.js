var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var shell = require('gulp-shell');
var prompt = require('gulp-prompt');
var folders = require('gulp-folders');

//复制 src/root 目录
gulp.task('CopyRoot', folders('./src/root', function (folder) {
    var srcPath, destPath;
    if (folder === 'root') {
        srcPath = [
            './src/root/root/**/*',
            './src/root/root/**/.*',
            '!**/README'];
        destPath = './dist';
        return gulp.src(srcPath).pipe(gulp.dest(destPath));
    } else {
        srcPath = [
            path.join('./src/root', folder, '**'),
            path.join('./src/root', folder, '**', '.*'),
            '!**/README'];
        destPath = path.join('./dist', folder.replace('__', '/'));
        return gulp.src(srcPath).pipe(gulp.dest(destPath));
    }
}));

//复制 src/configs 目录
gulp.task('CopyConfig', function () {
    gulp.src('gulpfile.js').pipe(prompt.prompt({
        type: 'input',
        name: 'name',
        message: 'Please enter the configuration environment name:'
    }, function (res) {
        gulp.src([
            path.join('./src/config', res.name, '**'),
            path.join('./src/config', res.name, '**', '.*'),
            '!**/README'])
            .pipe(gulp.dest('./dist'));
    }));
});

//复制 src/framework 目录
gulp.task('CopyFramework', function () {
    gulp.src([
        './src/framework/**',
        './src/framework/**/.*',
        '!**/README'])
        .pipe(gulp.dest('./dist'));
});

//初始化插件
gulp.task('InitAddon', function () {
    gulp.src('gulpfile.js').pipe(prompt.prompt({
        type: 'input',
        name: 'name',
        message: 'Please enter the name of the addon:'
    }, function (res) {
        gulp.src('gulpfile.js', {read: false})
            .pipe(shell([
                'cd dist && php think addon -a ' + res.name + ' -c disable',
                'cd dist && php think addon -a ' + res.name + ' -c upgrade',
                'cd dist && php think addon -a ' + res.name + ' -c enable'
            ]));
    }));
});

//初始化 src
gulp.task('InitSrc', function () {
    gulp.src(['./example/**', '!./example/**/*.php'])
        .pipe(gulp.dest('./src'));
});

//初始化 fastadmin
gulp.task('InitFastadmin', function () {
    fs.exists('./fastadmin', function (exists) {
        if (exists) {
            gulp.src('gulpfile.js', {read: false})
                .pipe(shell([
                    'cd fastadmin && bower install',
                    'cd fastadmin && composer install'
                ]));
        } else {
            gulp.src('gulpfile.js', {read: false})
                .pipe(shell('git clone https://gitee.com/karson/fastadmin.git'))
                .pipe(shell([
                    'cd fastadmin && bower install',
                    'cd fastadmin && composer install'
                ]));
        }
    });
});

//安装 fastadmin
gulp.task('InstallFastadmin', function () {
    gulp.src('gulpfile.js', {read: false})
        .pipe(shell('cd dist && php think install'));
});

//复制 fastadmin 目录
gulp.task('CopyFastadmin', function () {
    gulp.src([
        './fastadmin/**',
        './fastadmin/**/.*'])
        .pipe(gulp.dest('./dist'));
});
