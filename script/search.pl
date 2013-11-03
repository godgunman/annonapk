#!/usr/bin/env perl
#
use strict;
use Cwd 'abs_path';
use File::Basename;
use JSON::Parse 'json_file_to_perl';
use JSON;
use Data::Dumper;


my $analyticsROOT = abs_path(dirname(abs_path($0))."/../apk/analytics/");

sub main {
    my $result = [];
    opendir(my $D, $analyticsROOT) || die "Can't opedir: $!\n";
    while (my $f = readdir($D)) {
        next if $f =~ m/^\./;
        my $resultFile = $analyticsROOT."/".$f."/result";
        if(-f $resultFile) {
            my $json = json_file_to_perl ($resultFile);
            my $package = $json->{'package'};
            my $link = "http://annonapk.com/apk/analytics/$f";
            my $application_name = `sed -En 's/<application.*android:label="\@string\\/([^ ]*?)".*/\\1/gp' ${analyticsROOT}/$f/AndroidManifest.xml| xargs -n 1 -I "{}" grep {} ${analyticsROOT}/$f/res/values/strings.xml | sed -En 's/.*"app_name".*>(.*)<.*>/\\1/p'`;
            print $application_name;
            my $icon_path = `cat ${analyticsROOT}/$f/AndroidManifest.xml | sed -nE 's/.* android:icon="@[^ ]*\\/([^ ]*?)".*/\\1/p' | xargs -n 1 -I {} find ${analyticsROOT}/$f/res/drawable* -name '{}.*' | sort -n| head -1`;
            $application_name =~ s/[\x0d\x0a]//g;
            $icon_path =~ s/[\x0d\x0a]//g;
            $icon_path =~ s|^/.*/AnnonaPK(/apk/analytics.*)$|$1|;
            my %apk_info = (package => $package, link => $link, app_name => $application_name, icon_link => $icon_path);
            push @$result, \%apk_info;
        }
    }
    closedir($D);
    my $json = {};
    $json->{'result'} = $result;
    $json->{'error'} = undef;
    print to_json($json);
}

main;
