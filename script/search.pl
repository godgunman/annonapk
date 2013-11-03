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
            my %apk_info = (package => $package, link => $link);
            push @$result, \%apk_info;
        }
    }
    closedir($D);
    print to_json($result);
}

main;
